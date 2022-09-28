const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApisecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApisecret);

async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  console.log(files);
  let responses = [];
  console.log(`Uploading to IPFS...`);
  for (fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );
    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (err) {
      console.log(err);
    }
  }
  return { responses, files };
}

module.exports = { storeImages };
