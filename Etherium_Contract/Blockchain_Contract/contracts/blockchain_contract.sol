// SPDX-License-Identifier: UNLICENSED
// Specifies the version of Solidity, using semantic versioning.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#pragma
pragma solidity >=0.7.3;

contract BlockChain_DNS {
    // Define the base company wallet
    address public baseCompanyWallet;

    // Define a struct to represent a domain
    struct Domain {
        string ipAddr;
        string domain;
        string ipAddrType;
        uint256 timestamp;
        uint256 expiration;
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
    constructor(address _baseCompanyWallet) {
        baseCompanyWallet = _baseCompanyWallet;
    }

    // Function to get a domain by IP address
    function getDomain(string memory ipAddr) public view returns (string memory, string memory, uint256, uint256) {
        Domain storage domain = domains[ipAddr];
        return (domain.domain, domain.ipAddrType, domain.timestamp, domain.expiration);
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
    function addDomain(string memory ipAddr, string memory domain, string memory ipAddrType, uint256 timestamp, uint256 expiration) public onlyAuthCompanies {
        domains[ipAddr] = Domain(ipAddr, domain, ipAddrType, timestamp, expiration);
        ipAddresses.push(ipAddr);
    }

    // Function to get all domains and everything about them
    function getAllDomains() public view returns (string[] memory, string[] memory, string[] memory, uint256[] memory, uint256[] memory) {
        string[] memory allDomains = new string[](ipAddresses.length);
        string[] memory allIpAddrTypes = new string[](ipAddresses.length);
        string[] memory allIpAddrs = new string[](ipAddresses.length);
        uint256[] memory allTimestamps = new uint256[](ipAddresses.length);
        uint256[] memory allExpirations = new uint256[](ipAddresses.length);
        for (uint i = 0; i < ipAddresses.length; i++) {
            Domain storage domainObj = domains[ipAddresses[i]];
            allDomains[i] = domainObj.domain;
            allIpAddrTypes[i] = domainObj.ipAddrType;
            allIpAddrs[i] = domainObj.ipAddr;
            allTimestamps[i] = domainObj.timestamp;
            allExpirations[i] = domainObj.expiration;
        }
        return (allDomains, allIpAddrTypes, allIpAddrs, allTimestamps, allExpirations);
    }

    // Function to remove an IP address
    function removeIpAddress(string memory ipAddr) public onlyAuthCompanies {
        for (uint i = 0; i < ipAddresses.length; i++) {
            if (keccak256(abi.encodePacked(ipAddresses[i])) == keccak256(abi.encodePacked(ipAddr))) {
                delete ipAddresses[i];
            }
        }
    }

    // Function to remove a domain
    function removeDomain(string memory ipAddr) public onlyAuthCompanies {
        delete domains[ipAddr];
    }

    // Function to remove an authorized company wallet
    function removeAuthCompany(address wallet) public onlyBaseCompany {
        delete authCompanies[wallet];
    }

    // Function to transfer ownership of the contract
    function transferOwnership(address newOwner) public onlyBaseCompany {
        baseCompanyWallet = newOwner;
    }

    // Function to get the contract address
    function getContractAddress() public view returns (address) {
        return address(this);
    }
   
}
