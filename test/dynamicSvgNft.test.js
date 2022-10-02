const { assert, expect } = require("chai");
const { randomBytes } = require("ethers/lib/utils");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { deploy, log } = deployments;

const lowSvg = fs.readFileSync("./images/dynamicNft/frown.svg", {
  encoding: "utf-8",
});
const highSvg = fs.readFileSync("./images/dynamicNft/happy.svg", {
  encoding: "utf-8",
});

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("dynamic svg nft", () => {
      let dynamicSvgNft, EthUsdAggregator;
      beforeEach(async () => {
        let { deployer } = await getNamedAccounts();
        await deployments.fixture(["mocks", "dynamicsvg"]);
        dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer);
        EthUsdAggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("Mint NFT", async () => {
        it("mints nft and sets high uri when price is above highValue", async () => {
          const initialTokenCounter = await dynamicSvgNft.getTokenCounter();
          const highValue = ethers.utils.parseEther("1");
          await expect(dynamicSvgNft.mintNft(highValue)).to.emit(
            dynamicSvgNft,
            "CreatedNFT"
          );
          const finalTokenCounter = await dynamicSvgNft.getTokenCounter();
          assert.equal(
            finalTokenCounter.toString(),
            initialTokenCounter.add(1).toString()
          );
          assert.equal(highTokenUri, await dynamicSvgNft.tokenURI(0));
        });
      });
      it("sets low uri when price below highValue", async () => {
        const highValue = ethers.utils.parseEther("100000");
        await dynamicSvgNft.mintNft(highValue);
        assert.equal(lowTokenUri, await dynamicSvgNft.tokenURI(0));
      });
    });
