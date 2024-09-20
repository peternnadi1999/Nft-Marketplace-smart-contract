import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

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
    it("Should set the right unlockTime", async function () {
      const { nftMarketplace, owner } = await loadFixture(
        deployNFTMarketplaceFixture
      );
    });
  });
});
