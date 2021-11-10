// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrdinaryNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public constant maxAmount = 100;
    uint256 public currentAmount = 1;

    constructor() ERC721("OrdinaryNFT", "ONT") {}

    function safeMint(address to, string memory _tokenURI) public onlyOwner {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < maxAmount, "at capacity");
        _mint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function batchMint(address to, string[] memory _tokenURI) public onlyOwner {
        for (uint256 i = 0; i < _tokenURI.length; i++) {
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();
            require(tokenId < maxAmount, "at capacity");
            _mint(to, tokenId);
            _setTokenURI(tokenId, _tokenURI[i]);
        }
    }

    function purchase() external payable {
        // has to be minted
        require(currentAmount <= maxAmount, "no more nfts");
        // then you can buy it
        _purchase(currentAmount);
        currentAmount++;
    }

    function _purchase(uint256 nftId) private {
        _transfer(address(this), msg.sender, nftId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
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

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
