const { assert, expect } = require("chai");
const { randomBytes } = require("ethers/lib/utils");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { deploy, log } = deployments;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("random Ipfs Nft", () => {
      let randomIpfsNft, vrfCoordinatorV2Mock;
      beforeEach(async () => {
        let { deployer } = await getNamedAccounts();
        await deployments.fixture(["mocks", "randomipfs"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
      });
      describe("request Nft", () => {
        it("fails if payment isn't sent with the request", async () => {
          await expect(
            randomIpfsNft.requestNft()
          ).to.be.revertedWithCustomError(
            randomIpfsNft,
            "RandomIpfsNft__NeedMoreETHSent"
          );
        });
        it("fails if payment is less than mint fee", async () => {
          const mintFee = await randomIpfsNft.getMintFee();
          await expect(
            randomIpfsNft.requestNft({ value: mintFee / 10 })
          ).to.be.revertedWithCustomError(
            randomIpfsNft,
            "RandomIpfsNft__NeedMoreETHSent"
          );
        });
        it("emit event on success", async () => {
          const mintFee = await randomIpfsNft.getMintFee();
          await expect(
            randomIpfsNft.requestNft({ value: mintFee.toString() })
          ).to.emit(randomIpfsNft, "NftRequested");
        });
      });
      describe("Fulfill random words", () => {
        it("it mints nft and sets uri", async () => {
          const mintFee = await randomIpfsNft.getMintFee();
          const initialTokencounter = await randomIpfsNft.getTokenCounter();
          const tx = await randomIpfsNft.requestNft({ value: mintFee });
          const txRecepit = await tx.wait(1);
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            txRecepit.events[1].args.requestId,
            randomIpfsNft.address
          );
          const tokenUri = await randomIpfsNft.tokenURI(initialTokencounter);
          const endTokenCounter = await randomIpfsNft.getTokenCounter();
          assert.equal(
            endTokenCounter.toString(),
            (initialTokencounter.toNumber() + 1).toString()
          );
          assert.equal(tokenUri.toString().includes("ipfs://"), true);
        });
      });
    });
