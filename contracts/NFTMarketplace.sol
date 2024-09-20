// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 tokenIds;

    struct NFT {
        uint256 tokenId;
        address payable owner;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => NFT) public nftList;

    event NFTMinted(uint256 tokenId, address owner, string tokenURI);
    event NFTListed(uint256 tokenId, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);

    constructor() ERC721("NFTMarketplace", "NFTM") Ownable(msg.sender) {}

    function mintNFT(string memory tokenURI, uint256 price) public onlyOwner returns (uint256) {
        tokenIds++;
        uint256 newItemId = tokenIds;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        nftList[newItemId] = NFT({
            tokenId: newItemId,
            owner: payable(msg.sender),
            price: price,
            forSale: false
        });

        emit NFTMinted(newItemId, msg.sender, tokenURI);
        return newItemId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(price > 0, "Price must be greater than zero");

        nftList[tokenId].price = price;
        nftList[tokenId].forSale = true;

        emit NFTListed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        NFT memory nft = nftList[tokenId];
        require(nft.forSale, "This NFT is not for sale");
        require(msg.value >= nft.price, "Insufficient funds to buy this NFT");

        address payable seller = nft.owner;
        nft.owner = payable(msg.sender);
        nft.forSale = false;

        _transfer(seller, msg.sender, tokenId);
        seller.transfer(msg.value);

        emit NFTSold(tokenId, msg.sender, nft.price);
    }

    function transferNFT(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");

        _transfer(msg.sender, to, tokenId);
    }
}
