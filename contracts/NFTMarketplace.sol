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

    error YouAreNotTheOwnerOfThisNFT();
    error PriceMustBeGreaterThanZero();
    error ThisNFTIsNotForSale();
    error InsufficientFundsToBuyThisNFT();

    event NFTMintedSuccessfully(uint256 tokenId, address owner, string tokenURI);
    event NFTListedSuccessfully(uint256 tokenId, uint256 price);
    event NFTSoldSuccessfully(uint256 tokenId, address buyer, uint256 price);

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

        emit NFTMintedSuccessfully(newItemId, msg.sender, tokenURI);
        return newItemId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        if(ownerOf(tokenId) != msg.sender){
            revert YouAreNotTheOwnerOfThisNFT();
        }
        if(price < 0){
            revert PriceMustBeGreaterThanZero();
        }

        nftList[tokenId].price = price;
        nftList[tokenId].forSale = true;

        emit NFTListedSuccessfully(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable nonReentrant {
        NFT memory nft = nftList[tokenId];

        if(!nft.forSale){
            revert ThisNFTIsNotForSale();
        }

        if(msg.value <= nft.price){
            revert InsufficientFundsToBuyThisNFT();
        }

        address payable seller = nft.owner;
        nft.owner = payable(msg.sender);
        nft.forSale = false;

        _transfer(seller, msg.sender, tokenId);
        seller.transfer(msg.value);

        emit NFTSoldSuccessfully(tokenId, msg.sender, nft.price);
    }

    function transferNFT(address to, uint256 tokenId) public nonReentrant {
         if(ownerOf(tokenId) != msg.sender){
            revert YouAreNotTheOwnerOfThisNFT();
        }

        _transfer(msg.sender, to, tokenId);
    }
}
