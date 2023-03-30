// interact.js

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// For Hardhat
const contract = require("../artifacts/contracts/blockchain_contract.sol/BlockChain_DNS.json");
console.log(JSON.stringify(contract.abi));

// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract - blockchain_dns
const blockchain_dns = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

// interact with blockchain_dns
async function main() {
    const message = await blockchain_dns.message();
    console.log("The message is:" + message);

    console.log("Updating the message...");
    const tx = await blockchain_dns.update("This is the new message!");
    await tx.wait();

    const newMessage = await blockchain_dns.message();
    console.log("The new message is:" + newMessage);
}

main();