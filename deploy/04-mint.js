const { ethers, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();

  //Basic NFT
  const basicNft = await ethers.getContract("BasicNft", deployer);
  const basicNftTx = await basicNft.mintNft();
  await basicNftTx.wait(1);
  console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`);

  //Random IPFS NFT
  const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  const mintFee = await randomIpfsNft.getMintFee();
  const randomIpfsMintTx = await randomIpfsNft.requestNft({
    value: mintFee.toString(),
  });
  const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
  await new Promise(async (resolve, reject) => {
    setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000);
    randomIpfsNft.once("NftMinted", async () => {
      resolve();
    });
    if (chainId == 31337) {
      const requestId =
        randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatprV2Mock = await ethers.getContract(
        "VRFCoordiantorV2Mock",
        deployer
      );
      await vrfCoordinatprV2Mock.fulfillRandomWords(
        requestId,
        randomIpfsNft.address
      );
    }
  });
  console.log(
    `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
  );
};
