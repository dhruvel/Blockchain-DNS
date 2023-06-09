from __future__ import annotations as _annotations

import logging
import time
from datetime import datetime
from pathlib import Path
from textwrap import wrap
from typing import Any, List
from web3 import Web3, AsyncWeb3

import random

from dnslib import QTYPE, RR, DNSLabel, dns
from dnslib.proxy import ProxyResolver as LibProxyResolver
from dnslib.server import BaseResolver as LibBaseResolver, DNSServer as LibDNSServer

from load_records import Records, Zone, load_records

__all__ = 'DNSServer', 'logger'

SERIAL_NO = int((datetime.utcnow() - datetime(1970, 1, 1)).total_seconds())

handler = logging.StreamHandler()
handler.setLevel(logging.INFO)
handler.setFormatter(logging.Formatter('%(asctime)s: %(message)s', datefmt='%H:%M:%S'))

logger = logging.getLogger(__name__)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

#  Connect to the blockchain
w3 = Web3(Web3.HTTPProvider("https://eth-sepolia.g.alchemy.com/v2/jBy_7tzy_IZu2tALKlYFrRWW2Ff_ae3r"))

# Configure the contract
CONTRACT_ADDRESS = "0x1460D891bDFd3d3F8b41b4a3f64DeeEB27B64413"
CONTRACT_ABI = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"addAuthCompany","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"domain","type":"string"},{"internalType":"string","name":"ipAddr","type":"string"},{"internalType":"string","name":"ipAddrType","type":"string"},{"internalType":"address","name":"ownerId","type":"address"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"expiration","type":"uint64"}],"name":"addDomain","outputs":[{"components":[{"internalType":"string","name":"domain","type":"string"},{"internalType":"string","name":"ipAddr","type":"string"},{"internalType":"string","name":"ipAddrType","type":"string"},{"internalType":"address","name":"ownerId","type":"address"},{"internalType":"address","name":"authCompanyId","type":"address"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"expiration","type":"uint64"}],"internalType":"struct BlockChain_DNS.Domain","name":"","type":"tuple"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authCompanies","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseCompanyWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"domainExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"domainNames","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"domains","outputs":[{"internalType":"string","name":"domain","type":"string"},{"internalType":"string","name":"ipAddr","type":"string"},{"internalType":"string","name":"ipAddrType","type":"string"},{"internalType":"address","name":"ownerId","type":"address"},{"internalType":"address","name":"authCompanyId","type":"address"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"expiration","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllDomains","outputs":[{"components":[{"internalType":"string","name":"domain","type":"string"},{"internalType":"string","name":"ipAddr","type":"string"},{"internalType":"string","name":"ipAddrType","type":"string"},{"internalType":"address","name":"ownerId","type":"address"},{"internalType":"address","name":"authCompanyId","type":"address"},{"internalType":"uint64","name":"timestamp","type":"uint64"},{"internalType":"uint64","name":"expiration","type":"uint64"}],"internalType":"struct BlockChain_DNS.Domain[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"domainName","type":"string"}],"name":"getDomain","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint64","name":"expiration","type":"uint64"}],"stateMutability":"view","type":"function"}]'
contract_instance = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)


class Domain:
    def __init__(self, ipAddr: str, domain: str, ipAddrType: str, timestamp: int, expiration: int):
        self.ipAddr = ipAddr
        self.domain = domain
        self.ipAddrType = ipAddrType
        self.timestamp = timestamp
        self.expiration = expiration

TYPE_LOOKUP = {
    'A': (dns.A, QTYPE.A),
    'AAAA': (dns.AAAA, QTYPE.AAAA),
    'CAA': (dns.CAA, QTYPE.CAA),
    'CNAME': (dns.CNAME, QTYPE.CNAME),
    'DNSKEY': (dns.DNSKEY, QTYPE.DNSKEY),
    'MX': (dns.MX, QTYPE.MX),
    'NAPTR': (dns.NAPTR, QTYPE.NAPTR),
    'NS': (dns.NS, QTYPE.NS),
    'PTR': (dns.PTR, QTYPE.PTR),
    'RRSIG': (dns.RRSIG, QTYPE.RRSIG),
    'SOA': (dns.SOA, QTYPE.SOA),
    'SRV': (dns.SRV, QTYPE.SRV),
    'TXT': (dns.TXT, QTYPE.TXT),
    'SPF': (dns.TXT, QTYPE.TXT),
}
DEFAULT_PORT = 53
DEFAULT_UPSTREAM = '1.1.1.1'


class Record:
    def __init__(self, zone: Zone):
        self._rname = DNSLabel(zone.host)

        rd_cls, self._rtype = TYPE_LOOKUP[zone.type]

        args: list[Any]
        if isinstance(zone.answer, str):
            if self._rtype == QTYPE.TXT:
                args = [wrap(zone.answer, 255)]
            else:
                args = [zone.answer]
        else:
            if self._rtype == QTYPE.SOA and len(zone.answer) == 2:
                # add sensible times to SOA
                args = zone.answer + [(SERIAL_NO, 3600, 3600 * 3, 3600 * 24, 3600)]
            else:
                args = zone.answer

        if self._rtype in (QTYPE.NS, QTYPE.SOA):
            ttl = 3600 * 24
        else:
            ttl = 300

        self.rr = RR(
            rname=self._rname,
            rtype=self._rtype,
            rdata=rd_cls(*args),
            ttl=ttl,
        )

    def match(self, q):
        return q.qname == self._rname and (q.qtype == QTYPE.ANY or q.qtype == self._rtype)

    def sub_match(self, q):
        return self._rtype == QTYPE.SOA and q.qname.matchSuffix(self._rname)

    def __str__(self):
        return str(self.rr)


def resolve(request, handler, records):
    records = [Record(zone) for zone in records.zones]
    type_name = QTYPE[request.q.qtype]
    reply = request.reply()
    for record in records:
        if record.match(request.q):
            reply.add_answer(record.rr)

    if reply.rr:
        logger.info('found zone for %s[%s], %d replies', request.q.qname, type_name, len(reply.rr))
        return reply

    # no direct zone so look for an SOA record for a higher level zone
    for record in records:
        if record.sub_match(request.q):
            reply.add_answer(record.rr)

    if reply.rr:
        logger.info('found higher level SOA resource for %s[%s]', request.q.qname, type_name)
        return reply
    

def query_blockchain(ip: str):
    domain = contract_instance.functions.getDomain(ip[:-1]).call()
    if int(domain[1]) > int(time.time() * 1000):
        return domain[0]
    else :
        return None


class BaseResolver(LibBaseResolver):
    def __init__(self, records: Records):
        self.records = records
        super().__init__()

    def resolve(self, request, handler):
        answer = resolve(request, handler, self.records)
        if answer:
            return answer

        type_name = QTYPE[request.q.qtype]
        logger.info('no local zone found, not proxying %s[%s]', request.q.qname, type_name)
        return request.reply()


class ProxyResolver(LibProxyResolver):
    def __init__(self, records: Records, upstream: str):
        self.records = records
        super().__init__(address=upstream, port=53, timeout=5)

    def resolve(self, request, handler):
        answer = resolve(request, handler, self.records)
        if answer:
            return answer

        type_name = QTYPE[request.q.qtype]
        logger.info('no local zone found, proxying %s[%s]', request.q.qname, type_name)
        return super().resolve(request, handler)
    

class BlockchainResolver(LibProxyResolver):
    def __init__(self, records: Records):
        self.records = records

    def resolve(self, request, handler):
        answer = resolve(request, handler, self.records)
        if answer:
            return answer

        type_name = QTYPE[request.q.qtype]
        logger.info('no local zone found, querying blockchain for %s[%s]', request.q.qname, type_name)
        
        query = query_blockchain(str(request.q.qname))
        if query:
            # Save response to local zones
            self.records.zones.append(Zone(host=request.q.qname, type=type_name, answer=query))

            # Reply with the query
            a = request.reply()
            a.add_answer(dns.RR(request.q.qname, QTYPE.A, rdata=dns.A(query)))
            return a
        else:
            logger.info('no blockchain record found for %s[%s]', request.q.qname, type_name)
            return request.reply()


class DNSServer:
    def __init__(
        self,
        records: Records | None = None,
        port: int | str | None = DEFAULT_PORT,
        upstream: str | None = DEFAULT_UPSTREAM,
    ):
        self.port: int = DEFAULT_PORT if port is None else int(port)
        self.upstream: str | None = upstream
        self.udp_server: LibDNSServer | None = None
        self.tcp_server: LibDNSServer | None = None
        self.records: Records = records if records else Records(zones=[])

    @classmethod
    def from_toml(
        cls, zones_file: str | Path, *, port: int | str | None = DEFAULT_PORT, upstream: str | None = DEFAULT_UPSTREAM
    ) -> 'DNSServer':
        records = load_records(zones_file)
        logger.info(
            'loaded %d zone record from %s, with %s as a proxy DNS server',
            len(records.zones),
            zones_file,
            upstream,
        )
        return DNSServer(records, port=port, upstream=upstream)

    def start(self):
      #  if self.upstream:
      #      logger.info('starting DNS server on port %d, upstream DNS server "%s"', self.port, self.upstream)
      #      resolver = ProxyResolver(self.records, self.upstream)
      #  else:
      #      logger.info('starting DNS server on port %d, without upstream DNS server', self.port)
      #      resolver = BaseResolver(self.records)
        logger.info('starting DNS server on port %d with blockchain', self.port)
        resolver = BlockchainResolver(self.records)

        self.udp_server = LibDNSServer(resolver, port=self.port)
        self.tcp_server = LibDNSServer(resolver, port=self.port, tcp=True)
        self.udp_server.start_thread()
        self.tcp_server.start_thread()

    def stop(self):
        self.udp_server.stop()
        self.udp_server.server.server_close()
        self.tcp_server.stop()
        self.tcp_server.server.server_close()

    @property
    def is_running(self):
        return (self.udp_server and self.udp_server.isAlive()) or (self.tcp_server and self.tcp_server.isAlive())

    def add_record(self, zone: Zone):
        self.records.zones.append(zone)

    def set_records(self, zones: List[Zone]):
        self.records.zones = zones
