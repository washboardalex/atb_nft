const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OrdinaryNFT", async () => {
  let nftContract;
  beforeEach(async () => {
    const NFTContract = await ethers.getContractFactory("OrdinaryNFT");
    nftContract = await NFTContract.deploy();
  });
  it("should allow the owner to mint an nft", async () => {
    expect(await nftContract.totalSupply()).to.eq(0);
    const signer = (await ethers.getSigners())[0];
    await nftContract.safeMint(nftContract.address, "test uri");
    expect(await nftContract.totalSupply()).to.eq(1);
  });
  it("should allow a user to claim an nft", async () => {
    const signer = await ethers.getSigners();
    await nftContract.safeMint(nftContract.address, "test uri");
    expect(await nftContract.balanceOf(signer[1].address)).eq(0);
    await nftContract.connect(signer[1]).purchase();
    expect(await nftContract.balanceOf(signer[1].address)).eq(1);
  });
});
