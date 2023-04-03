// SPDX-License-Identifier: UNLICENSED
// Specifies the version of Solidity, using semantic versioning.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#pragma
pragma solidity >=0.8.19;

contract BlockChain_DNS {
    // Define the base company wallet
    address public baseCompanyWallet;

    // Define a struct to represent a domain
    struct Domain {
        string domain;
        string ipAddr;
        string ipAddrType;
        address ownerId;
        address authCompanyId;
        uint64 timestamp;
        uint64 expiration;
    }

    // Add an array to store all domain names
    string[] public domainNames;

    // Mapping of IP addresses to domains
    mapping(string => Domain) public domains;

    // Mapping of authorized company wallets
    mapping(address => bool) public authCompanies;

    // Modifier to restrict access to the base company wallet
    modifier onlyBaseCompany() {
        require(msg.sender == baseCompanyWallet, "Only the base company wallet can call this function");
        _;
    }

    // Constructor to initialize the base company wallet
    constructor() {
        baseCompanyWallet = msg.sender;
        authCompanies[baseCompanyWallet] = true;
    }

    // Function to get a domain by IP address
    function getDomain(string memory domainName) public view returns (string memory, uint64 expiration) {
        Domain storage domain = domains[domainName];
        return (domain.ipAddr, domain.expiration);
    }

    // Function to add an authorized company wallet
    function addAuthCompany(address wallet) public onlyBaseCompany {
        authCompanies[wallet] = true;
    }

    // Modifier to restrict access to authorized company wallets
    modifier onlyAuthCompanies() {
        require(authCompanies[msg.sender], "Only authorized company wallets can call this function");
        _;
    }

    // Function to add a domain
    function addDomain(string memory domain, string memory ipAddr, string memory ipAddrType, address ownerId, uint64 timestamp, uint64 expiration) public onlyAuthCompanies {
        domains[domain] = Domain(domain, ipAddr, ipAddrType, ownerId, msg.sender, timestamp, expiration);
        domainNames.push(domain);
    }

    // Function to get all domains
    function getAllDomains() public view returns (Domain[] memory) {
        Domain[] memory allDomains = new Domain[](domainNames.length);
        for (uint i = 0; i < domainNames.length; i++) {
            Domain storage domainObj = domains[domainNames[i]];
            allDomains[i] = domainObj;
        }
        return allDomains;
    }   
}
