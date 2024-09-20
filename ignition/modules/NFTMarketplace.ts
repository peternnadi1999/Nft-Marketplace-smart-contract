import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTMarketplaceModule = buildModule("NFTMarketplaceModule", (m) => {
  
  const nFTMarketplace = m.contract("NFTMarketplace");

  return { nFTMarketplace };
});

export default NFTMarketplaceModule;
