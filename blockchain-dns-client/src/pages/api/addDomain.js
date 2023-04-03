import { ethers, getNumber } from 'ethers';

export default async function handler(req, res) {
    const node = "https://rpc.sepolia.org";
    const provider = new ethers.JsonRpcProvider(node);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const blockchain_dns = new ethers.Contract(process.env.CONTRACT_ADDRESS, process.env.CONTRACT_ABI, signer);

    const timestamp = new Date().getTime();

    // Add req.expiryMonths to current date
    let expiryDate = new Date();
    const years = Math.floor(req.body.expiryMonths / 12);
    const months = req.body.expiryMonths % 12;
    expiryDate.setFullYear(expiryDate.getFullYear() + years);
    expiryDate.setMonth(expiryDate.getMonth() + months);

    const ipType = req.body.ip.includes(':') ? '6' : '4';

    blockchain_dns.addDomain(
        req.body.domain,
        req.body.ip,
        ipType,
        req.body.ownerId,
        timestamp,
        expiryDate.getTime(),
    ).then(() => {
        res.status(200).json({
            domain: req.body.domain,
            ipAddr: req.body.ip,
            ipAddrType: ipType,
            ownerId: req.body.ownerId,
            timestamp: timestamp,
            expiration: expiryDate.getTime(),
        });
    });
}