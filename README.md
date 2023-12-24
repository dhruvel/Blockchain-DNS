# DNS Cache Poisoning & Blockchain DNS
**Dhruv Sagar and Pablo Jose Araujo Camacho**  
*CP400S – Winter 2023*

## Table of Contents
1. [Introduction](#introduction)  
2. [Background](#background)  
   2.1 [Domain Name System](#domain-name-system)  
   2.2 [DNS Cache Poisoning](#dns-cache-poisoning)  
   2.3 [Blockchain Technology](#blockchain-technology)  
3. [Proposed Solution](#proposed-solution)  
   3.1 [Benefits of Using Blockchain for Domain Storage](#benefits-of-using-blockchain-for-domain-storage)  
   3.2 [Challenges and Limitations](#challenges-and-limitations)  
4. [Implementation and Infrastructure](#implementation-and-infrastructure)  
   4.1 [Tools and Methods](#tools-and-methods)  
   4.2 [Infrastructure and Processes](#infrastructure-and-processes)  
5. [Comparison with Existing Solutions](#comparison-with-existing-solutions)  
6. [Conclusion](#conclusion)  
7. [References](#references)

## 1. Introduction

In the modern digital era, the internet has become an integral part of our daily lives, shaping the way we communicate, access information, and conduct business. The Domain Name System (DNS) plays a crucial role in enabling this seamless connectivity by translating human-readable domain names into IP addresses, the 'phone numbers' of the internet.

However, the DNS infrastructure, designed decades ago, has become susceptible to various security threats, such as DNS cache poisoning and denial-of-service attacks. With the rapid advancements in technology, there is a growing need to explore innovative solutions to address these challenges and enhance the security, reliability, and efficiency of the domain storage system.

Blockchain technology, with its decentralized nature, transparency, and immutability, has emerged as a promising alternative to traditional systems. This report aims to investigate the potential of blockchain technology in revolutionizing domain storage and its implications for the future of the internet.

The report begins by providing an overview of the existing DNS infrastructure, outlining its inherent limitations and vulnerabilities. It then delves into the fundamentals of blockchain technology, exploring its unique characteristics and potential benefits in the context of DNS and domain storage. The proposed solution is presented, followed by a detailed discussion of the implementation, evaluation, and comparison with existing solutions.

Finally, the report concludes with a reflection on the potential impact of blockchain-based DNS systems and their implications for the future of the internet, highlighting the importance of continued innovation and collaboration in shaping a more secure and reliable digital landscape.

## 2. Background

### 2.1 Domain Name System

The Domain Name System (DNS) translates human-readable addresses into IP addresses, making it easy for us to remember server addresses. This process is facilitated by DNS Nameservers, which communicate with each other to find the IP addresses related to domain names. Domains are stored in Nameservers divided into Zones, usually geographically. Additionally, domains are stored in a hierarchy, with top-level domains (TLDs) owned by root domains and distributed by domain registrars.

There are two types of Nameservers: Authoritative and Recursive. Authoritative Nameservers provide definitive answers about a zone and can be hosted by companies or ISPs. Recursive Nameservers, on the other hand, ask other Nameservers for answers and search the internet for servers that match a domain name. Throughout the DNS resolution process, where the client and Nameservers interact to find a matching IP address for a domain name, caching plays a crucial role.

The DNS resolution process involves the following steps:

1. Client queries for a domain name.
2. ISP’s local Recursive Nameserver queries Authoritative Root servers, which refer them to the appropriate TLD server.
3. If the Authoritative TLD server doesn't know about the domain, it refers the Recursive Nameserver to the next TLD server.
4. Referrals continue until a Nameserver that knows about the domain or the server that owns the domain itself responds with an IP address.
5. The Recursive Nameserver returns the IP address to the client.

Caching is essential to make the DNS resolution process efficient. Once a Nameserver has information about a domain cached, it doesn’t need to go out to search for it and can return the information directly. While caching makes the system fast, it introduces disadvantages and vulnerabilities. Due to caching, domain changes can take up to 72 hours to propagate worldwide, and DNS Cache Poisoning attacks can result in Nameservers providing incorrect or malicious information ([DNS Propagation: A Necessary Evil?](https://ns1.com/resources/dns-propagation), n.d.; Gao, 2023).

### 2.2 DNS Cache Poisoning

DNS Cache Poisoning is an attack that aims to alter the information provided by a DNS server. If successful, it can modify domain names to point to malicious websites. The process of a DNS Cache Poisoning Attack involves:

1. The attacker performs a query for the domain to a victim Nameserver.
2. They start flooding the Nameserver with forged DNS replies from a spoofed DNS server using random Query IDs. The Port and the Question, Authority, and Additional Sections all need to be the same as the original query.
3. While the flooding is happening, the victim Nameserver queries other Nameservers, waiting for an answer from the spoofed server.
4. Once the spoofed server responds, if one of the Query IDs the attacker sent matches the one sent between the spoofed and the victim Nameservers, the victim Nameserver saves the forged reply to its cache and returns it.

There are several solutions to DNS Cache Poisoning, such as using Digital Signatures (DNSSEC) or Transport Layer Security (TLS/SSL). However, the report explores leveraging Blockchain technology to address this issue ([Gao, 2023](#references)).

### 2.3 Blockchain Technology

A Blockchain is an immutable list of items, known as blocks, that are linked to each other cryptographically and duplicated across numerous computers to form a network.

In a Proof of Work (PoW) Blockchain, such as Bitcoin, adding new blocks involves a process known as "mining." Users on the network compete to solve a complex cryptographic puzzle, requiring substantial computational power. The first miner to solve the puzzle adds the block to the chain, ensuring security and maintaining the decentralized nature of the Blockchain.

Another consensus mechanism, Proof of Stake (PoS), is used by Blockchains like Ethereum. In PoS, validators are randomly selected to confirm transactions and create new blocks based on factors like the quantity of cryptocurrency held. Unlike PoW, PoS is more energy-efficient and still ensures security and decentralization.

Blockchains are immutable; to change an item, a malicious user would have to change every block that comes after it. Over half of the users on the network must agree to changes for a new Blockchain to be considered official, making Blockchains highly secure.

Smart contracts are self-executing agreements on a Blockchain with terms directly written into code. They automatically execute tasks when predetermined conditions are met, eliminating the need for intermediaries. Smart contracts have various applications, such as financial services, supply chain management, and decentralized applications (DApps) ([Daly, 2023](#references); [Smart Contracts: What are they and how do they work?](https://www.iberdrola.com/innovation/smart-contracts); [Decentralised Applications (DApps)](https://research.csiro.au/blockchainpatterns/general-patterns/deployment-patterns/dapp/)).

## 3. Proposed Solution

### 3.1 Benefits of Using Blockchain for Domain Storage

One significant advantage of using blockchain for domain storage is enhanced security. The decentralized nature of blockchain storage reduces single points of failure and minimizes the risks associated with tampering. Data distribution across multiple nodes makes it harder for malicious actors to compromise the system or alter domain information.

Another benefit is increased transparency. Immutable records and public access to the blockchain improve trust and enable users to trace the history of domain data easily. This feature allows for greater confidence in the validity of domain information, as any attempts at tampering would be easily detectable and verifiable.

Resistance to censorship is a key advantage. The decentralized architecture of blockchain systems makes it challenging for governments or organizations to control domain information, protecting freedom of expression and ensuring website accessibility.

Furthermore, blockchain technology enables DNS systems to function with reduced reliance on intermediaries. Traditional domain management often depends on central authorities, which can be vulnerable to attacks. Blockchain-based domains operate without these centralized entities, streamlining the domain management process and reducing the potential for corruption or abuse.

Lastly, blockchain technology offers improved availability for domain data. By distributing domain information across multiple nodes, the system ensures data accessibility even if some nodes experience downtime or technical difficulties. This contributes to a more resilient and reliable domain storage infrastructure ([Benefits of Blockchain Technology](https://www.geeksforgeeks.org/benefits-of-blockchain-technology), 2022).


### 3.2 Challenges and Limitations

Despite the numerous benefits of using blockchain for domain storage, there are several challenges and limitations to consider. One such challenge is scalability. Handling large volumes of domain data on the blockchain can be resource-intensive, potentially affecting transaction speeds and overall system performance. Developers need to find ways to improve scalability without sacrificing the security and decentralization that make blockchain an attractive solution.

Another challenge is overcoming adoption barriers. Convincing users and stakeholders to migrate to a new system can be difficult, especially if they are accustomed to traditional domain management processes. To address this issue, blockchain-based domain storage solutions must demonstrate clear advantages over existing systems and provide seamless transition options to encourage adoption.

Compatibility with existing domain name infrastructure is also a concern. Blockchain-based domain storage solutions must ensure interoperability with traditional DNS systems to avoid fragmenting the internet or creating difficulties for users. This may require the development of additional tools to bridge the gap between blockchain-based and traditional systems.

## 4. Implementation and Infrastructure

### 4.1 Tools and Methods

To implement and evaluate a blockchain-based domain storage system, various tools and methods are required. The following were utilized in this project:

1. **Blockchain Platform Selection:** Choose an appropriate blockchain platform to build the system. In this case, the Ethereum network was chosen for its support for smart contracts and wide adoption.

2. **Smart Contract Development:** Develop a smart contract named "BlockChain_DNS" to automate domain management tasks such as registration and overall administration. This self-executing contract streamlines the management process and enhances security by removing the need for human intervention.

3. **Interoperability Solutions:** Ensure compatibility with traditional DNS systems for widespread adoption. Implement interoperability solutions such as tools or protocols that bridge the gap between blockchain-based and traditional systems.

4. **dnserver.py Library:** Utilize the dnserver.py Python library to facilitate interaction between traditional DNS nameservers and the blockchain-based domain storage system. This library enables DNS nameservers to query the blockchain instead of other DNS nameservers.

5. **web3.py Library:** Use the web3.py Python library to provide a convenient interface for working with the Ethereum blockchain. This library facilitates interaction with the Ethereum network, sending transactions, and managing smart contracts.

6. **Solidity Programming Language:** Develop the smart contract for the domain storage system using Solidity, a high-level, statically typed language designed for writing smart contracts on the Ethereum blockchain.

7. **Ethereum Network:** Leverage the Ethereum network to build and deploy the smart contract. Utilize a test network (Sepolia test network in this case) during development and testing for a safe and controlled environment to validate functionality, security, and performance ([samuelcolvin/dnserver](https://github.com/samuelcolvin/dnserver/tree/main), [web3.py 6.1.0 documentation](https://web3py.readthedocs.io/en/latest/quickstart.html), [Solidity 0.8.20 documentation](https://docs.soliditylang.org/en/latest/)).

## 4.2 Infrastructure and Processes

In our proposed blockchain-based domain storage system, the infrastructure and processes are designed to ensure compatibility with the current DNS while enhancing security and reliability. Here's a step-by-step explanation of how our system works:

1. A client queries a DNS server for a domain name.
2. The DNS server searches the blockchain for the corresponding IP address.
3. If the IP address is found in the blockchain, the DNS server caches the result and returns it to the client.

Even though our DNS server caches the result similarly to traditional DNS servers, we can be sure that this cache has not been tampered with, as there are no communications with outside DNS servers, and the Blockchain is immutable and can only be changed by authorized companies.

To achieve this seamless integration, we use the open-sourced `dnserver.py` as our DNS resolver. We have modified this resolver to query the blockchain through an API provided by the company Alchemy instead of communicating with other DNS nameservers. This modification eliminates the possibility of attackers injecting malicious data into the process ([Colvin, 2022](https://github.com/samuelcolvin/dnserver/tree/main)).

The smart contract deployed on the blockchain contains all the methods and data structures required for domain management, ensuring the integrity and transparency of the system. They include:

- **The Structure Domain:**
  - `string domain` – stores the actual domain name.
  - `string ipAddr` – stores the IP address of that domain.
  - `string ipAddrType` – stores the type of address.
  - `address ownerId` – stores the owner of the domain.
  - `address authCompanyId` – stores the ID of the authorized company.
  - `uint64 timestamp` – stores when the domain was posted.
  - `uint64 expiration` – stores when the domain expires.

- **The Functions:**
  - `getDomain` – returns the IP address & expiration date.
  - `addAuthCompany` – adds the wallet address as AuthCompany.
  - `addDomain` – adds a new domain in the blockchain.
  - `getAllDomains` – returns all the stored domains in the blockchain.

A base company is responsible for monitoring the blockchain and authorizing authenticated companies, the only entities allowed to access and modify the domain data stored on the blockchain. This setup mimics the existing structure where the Internet Corporation for Assigned Names and Numbers (ICANN) grants permission to certain domain registrars to host and sell domain names.

By maintaining compatibility with the current DNS infrastructure and incorporating the security benefits of blockchain technology, our system aims to provide a more secure and trustworthy domain storage solution without disrupting the current internet experience for users.

## 5. Comparison with Existing Solutions

We conducted tests to compare our Blockchain DNS implementation with traditional DNS. The tests covered querying domains that hadn’t been cached before, querying cached domains, and querying non-existent domains. Each test involved 10 different, relatively unknown domains to increase the likelihood that traditional DNS nameservers did not have them cached. The tests were performed in the following order:

1. **Querying Un-cached Domains:**
   - Traditional DNS has an average lookup time of 20 – 120ms ([What Is DNS Lookup Time & How to Reduce It?](https://sematext.com/glossary/dns-lookup-time/), n.d.).
   - Consistent with our tests, the average was around 46.1ms.
   - Our Blockchain DNS system took an average of 167.2ms to look up un-cached domains.
   - Traditional DNS is significantly faster than Blockchain DNS when looking up un-cached domains.

2. **Querying Cached Domains:**
   - In our tests, our system returned cached results in less than a millisecond, as they are saved in memory.
   - The same is true for traditional DNS, except for network roundtrip time compared to our locally tested system.
   - For this reason, we will assume both systems would perform similarly for cached results if they were running on the same hardware on the same network.

3. **Querying Non-Existent Domains:**
   - From our tests, traditional DNS took around 60ms to determine that a queried domain doesn’t exist.
   - Our Blockchain DNS system, on the other hand, took an average of 149ms, approximately the same time as looking up un-cached domains.

These tests were not perfect, and more thorough testing is needed to verify the results in a more controlled scenario. Several additional variables could have affected the results; for example, we had no way of knowing if the traditional DNS servers were searching for the domains or already had them cached. We could only query arbitrary domain names hoping they wouldn’t be cached already.

Despite initial observations suggesting traditional DNS is faster than Blockchain DNS in many aspects, Blockchain DNS has a significant performance advantage. Changes to a domain can take up to 72 hours to propagate worldwide in traditional DNS ([What Is DNS Lookup Time & How to Reduce It?](https://sematext.com/glossary/dns-lookup-time/), n.d.), whereas domain changes can be accessed instantly in Blockchain DNS after the transaction goes through, which takes an average of 12.28 seconds ([Ethereum Average Block Time](https://ycharts.com/indicators/ethereum_average_block_time), 2023).

Although our Blockchain DNS system appears slower than traditional DNS in initial tests, its faster update times and increased security warrant further research and improvement. Changes to our implementation could significantly enhance the performance of our Blockchain DNS, such as using faster or dedicated API servers (even if they’re still decentralized) to perform the Blockchain queries. Additionally, we could explore allowing the DNS servers themselves to be part of the Blockchain network, removing the need for an API middleman.

## 6. Conclusion

The implementation of blockchain technology for domain storage and delivery offers numerous advantages, such as enhanced security, increased transparency, resistance to censorship, reduced reliance on intermediaries, and improved availability. However, challenges and limitations, including scalability, adoption barriers, compatibility, and regulatory concerns, must be addressed for the technology to reach its full potential.

Comparing the proposed blockchain-based domain storage system with existing solutions highlights the trade-offs and areas for improvement. The future of the internet could be significantly impacted by the successful implementation of blockchain technology for domain storage, providing a more secure, transparent, and decentralized domain management infrastructure.

## 7. References

Gao, S. (2023, April 5). CP400S-Computer Security-week8-1_Local-DNS-Attack. Computer Science Department. Wilfrid Laurier University. N.A.

Gao, S. (2023, April 5). CP400S-Computer Security-week8-2_Remote-DNS-Attack. Computer Science Department. Wilfrid Laurier University. N.A.

(n.d.) DNS Propagation: A Necessary Evil?. Ns1. https://ns1.com/resources/dns-propagation

Daly, L. (2023, March 13). What Is Proof of Work (PoW) in Crypto?. Fool. https://www.fool.com/investing/stock-market/market-sectors/financials/cryptocurrency-stocks/proof-of-work/

Daly, L. (2022, December 12). What Is Proof of Stake (PoS) in Crypto?. Fool. https://www.fool.com/investing/stock-market/market-sectors/financials/cryptocurrency-stocks/proof-of-stake/

(n.d.) Smart Contracts: What are they and how do they work?. Iberdrola. https://www.iberdrola.com/innovation/smart-contracts

(n.d.) Decentralised Applications (DApps). Blockchain Patterns. https://research.csiro.au/blockchainpatterns/general-patterns/deployment-patterns/dapp/

(n.d.) What Is DNS Lookup Time & How to Reduce It?. Sematext. https://sematext.com/glossary/dns-lookup-time/ 

(2023, April 4). Ethereum Average Block Time. Ycharts. https://ycharts.com/indicators/ethereum_average_block_time

(2022, September 1) Introduction to smart contracts. Ethereum. https://ethereum.org/en/developers/docs/smart-contracts/

(n.d.) web3.py 6.1.0 documentation. Web3py. https://web3py.readthedocs.io/en/latest/quickstart.html

(n.d.) Solidity 0.8.20 documentation. Docs. https://docs.soliditylang.org/en/latest/

(2022, June 23). Benefits of Blockchain Technology. Geeksforgeeks. https://www.geeksforgeeks.org/benefits-of-blockchain-technology/

Colvin, S. (2022, September 30). samuelcolvin/dnserver. Github. https://github.com/samuelcolvin/dnserver/tree/main


