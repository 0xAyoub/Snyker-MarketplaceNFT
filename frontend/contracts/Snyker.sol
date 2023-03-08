//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Snyker is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address payable admin;

    uint256 priceMarket = 0.01 ether;



// STUCT
    struct Sneaker {
        uint tokenId;
        string name;
        string description;
        address payable owner;
        uint price;
        bool firstSale;
        bool isInSale;
    }


// EVENTS
    event listPriceUpdated (
        uint256 priceMarket
    );

      event tokenCreated (
        uint tokenId,
        string name,
        string description,
        address owner,
        uint price,
        bool firstSale,
        bool isInSale
    );

    event releaseExecuted(address owner, uint tokenId, bool isInSale, bool firstSale);
    event sneakerSelled(uint price, uint tokenId, bool isInSale, bool firstSale);
    event saleExecuted(address owner, uint price, uint tokenId, bool isInSale, bool firstSale);




    mapping(uint256 => Sneaker) private idOfSneaker;

    constructor() ERC721("Snyker", "STK") {
        admin = payable(msg.sender);
    }

    function updateListPrice(uint256 _priceMarket) public payable {
        require(admin == msg.sender, "Only owner can update listing price");
        priceMarket = _priceMarket;
        emit listPriceUpdated(_priceMarket);
    }

    function getListPrice() public view returns (uint256) {
        return priceMarket;
    }

    function getLatestIdToListedToken() public view returns (Sneaker memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idOfSneaker[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (Sneaker memory) {
        return idOfSneaker[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(string memory tokenURI, string memory name, string memory description, uint256 price) public payable returns (uint) {

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();


        _safeMint(msg.sender, newTokenId);


        _setTokenURI(newTokenId, tokenURI);


        createListedToken(newTokenId, name, description, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, string memory name, string memory description, uint256 price) private {

        require(msg.value >= priceMarket, "Hopefully sending the correct price");
        require(price > 0, "Make sure the price isn't negative");


        idOfSneaker[tokenId] = Sneaker(
            tokenId,
            name,
            description,
            payable(msg.sender),
            price,
            true,
            true
        );

        _transfer(msg.sender, address(this), tokenId);

        emit tokenCreated(
            tokenId,
            name,
            description,
            msg.sender,
            price,
            true,
            true
        );
    }
    

    function getAllNFTs() public view returns (Sneaker[] memory) {
        uint nftCount = _tokenIds.current();
        Sneaker[] memory tokens = new Sneaker[](nftCount);
        uint currentIndex = 0;
        uint currentId;


        for(uint i=0;i<nftCount;i++){
            if(idOfSneaker[i+1].isInSale == true){
                currentId = i + 1;
                Sneaker storage currentItem = idOfSneaker[currentId];
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return tokens;
    }
    

    function getMyNFTs() public view returns (Sneaker[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;

        for(uint i=0; i < totalItemCount; i++)
        {
            if(idOfSneaker[i+1].owner == msg.sender && idOfSneaker[i+1].isInSale == false){
                itemCount += 1;
            }
        }


        Sneaker[] memory items = new Sneaker[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idOfSneaker[i+1].owner == msg.sender && idOfSneaker[i+1].isInSale == false) {
                currentId = i+1;
                Sneaker storage currentItem = idOfSneaker[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


    function executeRelease(uint tokenId) public payable {

        require(msg.value >= idOfSneaker[tokenId].price, "Not enough funds");


        payable(idOfSneaker[tokenId].owner).transfer(msg.value);

        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);

        idOfSneaker[tokenId].owner = payable(msg.sender);
        idOfSneaker[tokenId].isInSale = false;
        idOfSneaker[tokenId].firstSale = false;

        emit releaseExecuted(msg.sender, tokenId, true, false);

    }
    

    function sellSneaker(uint tokenId, uint price) public payable returns(string memory) {

        require(msg.value >= priceMarket, "Send enough ether to sell a sneakers (0.01 ether)");
        require(msg.sender == idOfSneaker[tokenId].owner, "You're not a owner of this sneaker");

        idOfSneaker[tokenId].isInSale = true;
        idOfSneaker[tokenId].firstSale = false;
        idOfSneaker[tokenId].price = price * 10 ** 18;


        payable(admin).transfer(priceMarket);

        emit sneakerSelled(price, tokenId, true, false);
        
        return string("Sneaker in sell");

    }


  
    function executeSale(uint tokenId) public payable {
        require(idOfSneaker[tokenId].isInSale, "Sneaker is not in sell");

        uint price = idOfSneaker[tokenId].price;

        require(msg.value >= price, "Not enough funds");

        address _owner = idOfSneaker[tokenId].owner;

        _transfer(_owner, msg.sender, tokenId);
        payable(_owner).transfer(price);

        idOfSneaker[tokenId].owner = payable(msg.sender);
        idOfSneaker[tokenId].isInSale = false;

        emit saleExecuted(msg.sender, price, tokenId, false, false);

    }



     function withdrawAll() external {
        require(msg.sender == admin, "Only owner can withdraw");
        admin.transfer(address(this).balance);
    }

}
