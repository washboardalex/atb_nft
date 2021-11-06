pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrdinaryNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    uint256 const public PRICE = 3 ether;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("OrdinaryNFT", "ONT") {}

    function safeMint(address to, string tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(newItemId, tokenURI);
    }


    function purchase(uint256 nftId) external payable returns (uint256) {
        // has to be minted
        require(nftId < _tokenIdCounter.current());
        // have to pay enough
        require(
            msg.value >= PRICE,
            "value less than price of nft"
        );
        // has to not already be purchased
        require(ownerOf(nftId) == address(this));
        // then you can buy it
        _purchase(nftId);
    }

    function _purchase(uint256 nftId) private {
        address payable buyer = msg.sender;
        ERC721(address(this))).transferFrom(address(this), buyer, nftId);
    }

    
    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
}
