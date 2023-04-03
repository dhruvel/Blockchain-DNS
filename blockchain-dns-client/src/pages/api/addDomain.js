import { ethers, getNumber } from 'ethers';

export default async function handler(req, res) {
    const node = "https://rpc.sepolia.org";
    const provider = new ethers.JsonRpcProvider(node);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const blockchain_dns = new ethers.Contract(process.env.CONTRACT_ADDRESS, process.env.CONTRACT_ABI, signer);

    // Add req.expiryMonths to current date
    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + req.expiryMonths); 

    blockchain_dns.addDomain(req.domain, req.ip, req.ownerId).then(domain => {
        res.status(200).json(domain);
    });
}