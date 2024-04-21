// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IOracle {
    function createLlmCall(uint promptId) external returns (uint);
}

contract NFTCollection is ERC721Enumerable, Ownable {
    using ECDSA for bytes32;

    address private oracleAddress;
    uint256 private nftCount;

    struct NFTAttributes {
        string traitsJson;
    }

    mapping(uint256 => NFTAttributes) public nftAttributes;
    event NFTMinted(uint256 indexed tokenId, string traitsJson);

    constructor(address _oracleAddress) ERC721("DynamicNFT", "DYN") {
        oracleAddress = _oracleAddress;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not the oracle");
        _;
    }

    function mintNFT() public returns (uint256) {
        uint256 newTokenId = nftCount++;
        // Assuming the oracle call sets up initial attributes
        IOracle(oracleAddress).createLlmCall(newTokenId);
        _mint(msg.sender, newTokenId);
        return newTokenId;
    }

    // Oracle response handling
    function onOracleResponse(uint256 tokenId, string calldata traitsJson) external onlyOracle {
        require(_exists(tokenId), "Token ID does not exist");
        nftAttributes[tokenId].traitsJson = traitsJson;
        emit NFTMinted(tokenId, traitsJson);
    }

    event OracleAddressUpdated(address indexed newOracleAddress);

    // Utility functions (assuming simple use-case for demonstrations)
    function getNFTTraits(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return nftAttributes[tokenId].traitsJson;
    }
}
