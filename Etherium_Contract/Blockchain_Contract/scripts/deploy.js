async function main() {
  // We get the contract to deploy
  const Blockchain_DNS = await ethers.getContractFactory("BlockChain_DNS");
  
  // Start deployment, returning a promise that resolves to a contract object
  const blockchain_dns = await Blockchain_DNS.deploy();
  console.log("Blockchain_DNS deployed to:", blockchain_dns.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
