//DynamicSvgNft.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private i_lowImageUri;
    string private i_highImageUri;
    string private constant base64EncodedSvgPrefix =
        "data:image/svg+xml;base64,";

    constructor(string memory lowSvg, string memory highSvg)
        ERC721("Dynamic SVG NFT", "DYN")
    {
        s_tokenCounter = 0;
    }

    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {}

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
    }
}
