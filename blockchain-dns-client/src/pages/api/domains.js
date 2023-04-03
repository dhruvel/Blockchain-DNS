import { ethers, getNumber } from 'ethers';

export default async function handler(req, res) {
    const node = "https://rpc.sepolia.org";
    const provider = new ethers.JsonRpcProvider(node);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const blockchain_dns = new ethers.Contract(process.env.CONTRACT_ADDRESS, process.env.CONTRACT_ABI, signer);
  
    blockchain_dns.getAllDomains().then(domains => {
        let parsedDomains = [];
        for(let i = 0; i < domains.length; i++) {
            parsedDomains.push({
                domain: domains[i].domain,
                ipAddr: domains[i].ipAddr,
                ipAddrType: domains[i].ipAddrType,
                ownerId: domains[i].ownerId,
                authCompanyId: domains[i].authCompanyId,
                timestamp: getNumber(domains[i].timestamp),
                expiration: getNumber(domains[i].expiration),
            });
        }
        res.status(200).json(parsedDomains);
    });
  
    /* return [
        {
            hash: '0x1232',
            domain: 'lolesports.com',
            ip: '1.2.3.0',
            ipType: 'ipv4',
            ownerId: '0x1232',
            authCompanyId: '0x1234',
            timestamp: '2021-01-01',
            expiry: '2021-01-01',
        },
        {
            hash: '0x1234',
            domain: 'pvp.net',
            ip: '1.2.3.4',
            ipType: 'ipv4',
            ownerId: '0x1234',
            authCompanyId: '0x1234',
            timestamp: '2021-01-01',
            expiry: '2021-01-01',
        },
        {
            hash: '0x1235',
            domain: 'google.ca',
            ip: '1.2.3.5',
            ipType: 'ipv4',
            ownerId: '0x1234',
            authCompanyId: '0x1234',
            timestamp: '2021-01-01',
            expiry: '2021-01-01',
        }
    ]; */
}