// interact.js

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// For Hardhat
const contract = require("../artifacts/contracts/blockchain_contract.sol/BlockChain_DNS.json");
console.log(JSON.stringify(contract.abi));

// provider - Alchemy
//const alchemyProvider = new ethers.providers.AlchemyProvider(network='sepolia', API_KEY);
const node = "https://rpc.sepolia.org";
const provider = new ethers.providers.JsonRpcProvider(node);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// contract - blockchain_dns
const blockchain_dns = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

// interact with blockchain_dns
async function main() {
    console.log("Adding domain...");
    // domain, ip, iptype, timestamp, expiration
    const date = new Date();
    const expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 1);
    const tx = await blockchain_dns.addDomain('pvp.net', '1.2.3.0', '4', '0x8Fc5f1358Fd316609e3eBCf0338f92b6eD6DBaDF', date.getTime(), expiration.getTime());
    await tx.wait();

    domains = await blockchain_dns.getAllDomains();
    console.log("Domains: ");
    console.log(domains);
}

main();