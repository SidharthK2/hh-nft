const { network, getNamedAccounts, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");

const imagesLocation = "./images/randomNft";

const metaDataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "cuteness",
      value: 100,
    },
  ],
};

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let tokenUris;

  //get ipfs hases for images
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris();
  }

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }
  log("----------------------");
  await storeImages(imagesLocation);
  //   const args = [
  //     vrfCoordinatorV2Address,
  //     subscriptionId,
  //     networkConfig[chainId].gasLane,
  //     networkConfig[chainId].callbackGasLimit,
  //     //toekn uri,
  //     networkConfig[chainId].mintFee,
  //   ];
};

async function handleTokenUris() {
  tokenUris = [];
  const { reponses: imageUploadResponses, files } = await storeImages(
    imagesLocation
  );
  for (index in imageUploadResponses) {
    let tokenUriMetadata = { ...metaDataTemplate };
    tokenUriMetadata.name = files[index].replace(".png", "");
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[index].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    //store josn to ipfs/pinata
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log(`Token URIS uploaded!, they are ${tokenUris}`);
  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
