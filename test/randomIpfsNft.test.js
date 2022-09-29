const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { deploy, log } = deployments;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("random Ipfs Nft", () => {
      let randomIpfsNft, vrfCoordinatorV2Mock, deployer;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "randomipfs"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft");
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
      });
      describe("requestNft", () => {
        it("fails if payment isn't sent with the request", async function () {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
            "RandomIpfsNft__NeedMoreETHSent"
          );
        });
      });
    });
