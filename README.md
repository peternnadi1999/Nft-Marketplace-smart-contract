# NFT Marketplace Smart Contract

This project implements a simple NFT (Non-Fungible Token) marketplace using Solidity smart contracts. It allows for minting, listing, buying, and transferring NFTs on the Ethereum blockchain.

## Features

- Mint new NFTs with associated metadata (tokenURI)
- List NFTs for sale
- Buy listed NFTs
- Transfer NFTs between addresses
- Implemented using OpenZeppelin's ERC721 standard
- Includes reentrancy protection and ownership controls

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Hardhat

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/peternnadi1999/Nft-Marketplace-smart-contract
   cd nft-marketplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Compile the smart contracts:
   ```
   npx hardhat compile
   ```

2. Run tests (if available):
   ```
   npx hardhat test
   ```

3. Deploy to a network:
   ```
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

## Contract Details

The main contract `NFTMarketplace` inherits from:
- `ERC721URIStorage`: For NFT functionality with metadata
- `Ownable`: For access control
- `ReentrancyGuard`: For protection against reentrancy attacks

Key functions:
- `mintNFT`: Mint a new NFT (only owner)
- `listNFT`: List an NFT for sale
- `buyNFT`: Purchase a listed NFT
- `transferNFT`: Transfer an NFT to another address

## Security Considerations

- The contract uses OpenZeppelin's battle-tested implementations for core functionality.
- Reentrancy protection is implemented for critical functions.
- Owner-only functions are restricted using the `Ownable` contract.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Disclaimer

This smart contract is provided as-is, without any warranties or guarantees. Users should exercise caution and thoroughly test and audit the code before using it in any production environment.