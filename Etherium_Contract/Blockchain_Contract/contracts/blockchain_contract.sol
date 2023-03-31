// SPDX-License-Identifier: UNLICENSED
// Specifies the version of Solidity, using semantic versioning.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#pragma
pragma solidity >=0.7.3;

contract BlockChain_DNS {
    // Define the base company wallet
    address public baseCompanyWallet;

    // Define a struct to represent a domain
    struct Domain {
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
        domains[ipAddr] = Domain(domain, ipAddrType, timestamp, expiration);
    }

    // Function to check if an IP address is authorized
    function isAuthorized(string memory ipAddr) public view returns (bool) {
        Domain storage domain = domains[ipAddr];
        if (domain.timestamp == 0) {
            return false;
        }
        if (domain.expiration < block.timestamp) {
            return false;
        }
        return true;
    }

    // Function to get domains by domain name
    function getDomainsByDomain(string memory domain) public view returns (string[] memory) {
        string[] memory domainsByDomain = new string[](ipAddresses.length);
        uint256 index = 0;
        for (uint i = 0; i < ipAddresses.length; i++) {
            Domain storage domainObj = domains[ipAddresses[i]];
            if (keccak256(abi.encodePacked(domainObj.domain)) == keccak256(abi.encodePacked(domain))) {
                domainsByDomain[index] = ipAddresses[i];
                index++;
            }
        }
        return domainsByDomain;
    }

    // Function to get domains by IP address type
    function getDomainsByIpAddrType(string memory ipAddrType) public view returns (string[] memory) {
        string[] memory domainsByIpAddrType = new string[](ipAddresses.length);
        uint256 index = 0;
        for (uint i = 0; i < ipAddresses.length; i++) {
            Domain storage domainObj = domains[ipAddresses[i]];
            if (keccak256(abi.encodePacked(domainObj.ipAddrType)) == keccak256(abi.encodePacked(ipAddrType))) {
                domainsByIpAddrType[index] = ipAddresses[i];
                index++;
            }
        }
        return domainsByIpAddrType;
    }

    // Function to return all IP addresses
    function getIpAddresses() public view returns (string[] memory) {
        return ipAddresses;
    }

    // Function to add an IP address
    function addIpAddress(string memory ipAddr) public onlyAuthCompanies {
        ipAddresses.push(ipAddr);
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

    // Function to withdraw funds from the contract
    function withdraw() public onlyBaseCompany {
        payable(baseCompanyWallet).transfer(address(this).balance);
    }

    // Function to deposit funds into the contract
    function deposit() public payable onlyBaseCompany {}

    // Function to get the contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to get the contract address
    function getContractAddress() public view returns (address) {
        return address(this);
    }

    // Function to get the base company wallet
    function getBaseCompanyWallet() public view returns (address) {
        return baseCompanyWallet;
    }
   
}
