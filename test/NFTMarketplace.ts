import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("NFTMarketplace", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNFTMarketplaceFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const NFTMarketplace = await hre.ethers.getContractFactory(
      "NFTMarketplace"
    );
    const nftMarketplace = await NFTMarketplace.deploy();

    return { nftMarketplace, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should ensure that the name and symbols are currect", async function () {
      const { nftMarketplace, owner } = await loadFixture(
        deployNFTMarketplaceFixture
      );
      expect(await nftMarketplace.name()).to.be.equal("JangNFT");
      expect(await nftMarketplace.symbol()).to.be.equal("JNFT");
    });
  });

  describe("Mint NFT", () => {
    it("Should mint the NFT", async () => {
      const { nftMarketplace, owner } = await loadFixture(
        deployNFTMarketplaceFixture
      );

      let tokenId = 1;

      expect(
        await nftMarketplace
          .connect(owner)
          .mintNFT(
            "https://github.com/peternnadi1999/Nft-Marketplace-smart-contract",
            900
          )
      )
        .to.emit(nftMarketplace, "NFTMintedSuccessfully")
        .withArgs(tokenId, owner, 900);
    });
  });

  describe("List NFT", () => {
    it("Check if the person list the NFT is the owner", async () => {
      const { nftMarketplace, owner, otherAccount } = await loadFixture(
        deployNFTMarketplaceFixture
      );

      await nftMarketplace
        .connect(owner)
        .mintNFT(
          "https://github.com/peternnadi1999/Nft-Marketplace-smart-contract",
          900
        );

      let tokenId = 1;

      expect(
        await nftMarketplace.connect(otherAccount).ownerOf(tokenId)
      ).to.be.revertedWithCustomError(
        nftMarketplace,
        "YouAreNotTheOwnerOfThisNFT"
      );
    });

    it("Should check if price is less than zero", async () => {
      const { nftMarketplace, owner } = await loadFixture(
        deployNFTMarketplaceFixture
      );

      await nftMarketplace
        .connect(owner)
        .mintNFT(
          "https://github.com/peternnadi1999/Nft-Marketplace-smart-contract",
          900
        );

      let tokenId = 1;

      expect(
        await nftMarketplace.connect(owner).listNFT(tokenId, 0)
      ).to.be.revertedWithCustomError(
        nftMarketplace,
        "PriceMustBeGreaterThanZero"
      );
    });

    it("Should List the NFT", async () => {
      const { nftMarketplace, owner } = await loadFixture(
        deployNFTMarketplaceFixture
      );

      await nftMarketplace
        .connect(owner)
        .mintNFT(
          "https://github.com/peternnadi1999/Nft-Marketplace-smart-contract",
          900
        );

      let tokenId = 1;

      expect(await nftMarketplace.connect(owner).listNFT(tokenId, 900))
        .to.emit(nftMarketplace, "NFTListedSuccessfully")
        .withArgs(tokenId, 900);
    });
  });
  describe("Transfer NFT", () => {
    it("Should Transfer the NFT", async () => {
      const { nftMarketplace, owner, otherAccount } = await loadFixture(
        deployNFTMarketplaceFixture
      );

      await nftMarketplace
        .connect(owner)
        .mintNFT(
          "https://github.com/peternnadi1999/Nft-Marketplace-smart-contract",
          900
        );

      let tokenId = 1;

      await nftMarketplace.connect(owner).transferNFT(otherAccount, tokenId);
    });
  });

  describe("Buy NFT", () => {
    it("Should purchase the NFT", async () => {
      const { nftMarketplace, owner, otherAccount } = await loadFixture(
        deployNFTMarketplaceFixture
      );

      await nftMarketplace
        .connect(owner)
        .mintNFT(
          "https://github.com/peternnadi1999/Nft-Marketplace-smart-contract",
          ethers.parseEther("1")
        );

      let tokenId = 1;
      const nft = await nftMarketplace.nftList(tokenId);

      expect(nft.forSale).to.be.revertedWithCustomError(
        nftMarketplace,
        "ThisNFTIsNotForSale"
      );

      await nftMarketplace.connect(owner).listNFT(tokenId, ethers.parseEther("1"));

      await expect(
        nftMarketplace
          .connect(otherAccount)
          .buyNFT(tokenId, { value: ethers.parseEther("0.5") })
      ).revertedWithCustomError(
        nftMarketplace,
        "InsufficientFundsToBuyThisNFT"
      );


      await expect(nftMarketplace.connect(otherAccount).buyNFT(tokenId, { value: ethers.parseEther("1") }))
        .to.emit(nftMarketplace, "NFTSoldSuccessfully")
        .withArgs(tokenId, otherAccount, ethers.parseEther("1"));
    });
  });
});
