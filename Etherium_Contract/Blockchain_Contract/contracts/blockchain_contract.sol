// SPDX-License-Identifier: UNLICENSED
// Specifies the version of Solidity, using semantic versioning.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#pragma
pragma solidity >=0.8.19;

contract BlockChain_DNS {
    // Define the base company wallet
    address public baseCompanyWallet;

    // Define a struct to represent a domain
    struct Domain {
        string ipAddr;
        string domain;
        string ipAddrType;
        address ownerId;
        address authCompanyId;
        uint64 timestamp;
        uint64 expiration;
    }

    // Add an array to store all IP addresses
    string[] public ipAddresses;

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
    function getDomain(string memory ipAddr) public view returns (string memory, uint64 expiration) {
        Domain storage domain = domains[ipAddr];
        return (domain.domain, domain.expiration);
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
    function addDomain(string memory ipAddr, string memory domain, string memory ipAddrType, address ownerId, uint64 timestamp, uint64 expiration) public onlyAuthCompanies {
        domains[ipAddr] = Domain(ipAddr, domain, ipAddrType, ownerId, msg.sender, timestamp, expiration);
        ipAddresses.push(ipAddr);
    }

    // Function to get all domains
    function getAllDomains() public view returns (Domain[] memory) {
        Domain[] memory allDomains = new Domain[](ipAddresses.length);
        for (uint i = 0; i < ipAddresses.length; i++) {
            Domain storage domainObj = domains[ipAddresses[i]];
            allDomains[i] = domainObj;
        }
        return allDomains;
    }   
}
