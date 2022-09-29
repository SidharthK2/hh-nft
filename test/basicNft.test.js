const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { deploy, log } = deployments;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("basic Nft", function () {
      let basicNft;
      beforeEach(async () => {
        let { deployer } = await getNamedAccounts();
        await deployments.fixture(["basicnft"]);
        basicNft = await ethers.getContract("BasicNFT", deployer);
      });

      describe("constructor", function () {
        it("sets the name and symbol and counter correctly", async () => {
          const name = await basicNft.name();
          const symbol = await basicNft.symbol();
          const counter = await basicNft.getTokenCounter();
          assert.equal(name, "Dogie");
          assert.equal(symbol, "DOG");
          assert.equal(counter, 0);
        });
        it("returns correct token URI", async () => {
          const id = await basicNft.getTokenCounter();
          const response = await basicNft.tokenURI(id);
          assert.equal(response, await basicNft.TOKEN_URI());
        });
      });
      describe("It allows users to mint NFT and updates the contract", async () => {
        const tx = await basicNft.mintNFT();
        await tx.wait(1);
        const tokenCounter = await basicNft.getTokenCounter();
        assert(tokenCounter, 1);
        assert(tokenURI);
      });
    });
