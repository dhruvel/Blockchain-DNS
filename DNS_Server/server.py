from dnserver import DNSServer
import time

server = DNSServer(records=None, port=5053, upstream=None)# ('example_zones.toml', port=5053)
server.start()
assert server.is_running

while server.is_running:
    time.sleep(1)

server.stop()