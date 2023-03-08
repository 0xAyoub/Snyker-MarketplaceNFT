const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Units tests of Snyker smart-contract", function () {
        let accounts;
        let snykerContract;

        before(async() => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
        })

    beforeEach(async () => {
      accounts = await ethers.getSigners();
  
      const Snyker = await ethers.getContractFactory("Snyker");
      snykerContract = await Snyker.deploy();
      await snykerContract.deployed();
    });
  
    it("should create a new token", async function () {
      const name = "test-sneaker";
      const description = "this is a test sneaker";
      const price = ethers.utils.parseEther("1");
      const tokenURI = "https://test-sneaker.com";
      await snykerContract.createToken(
        tokenURI,
        name,
        description,
        price,
        { value: price }
      );

    });
  
    it("should get list price", async function () {
      const priceMarket = ethers.utils.parseEther("0.01");
      await snykerContract.updateListPrice(priceMarket);
  
      const result = await snykerContract.getListPrice();
      expect(result).to.equal(priceMarket);
    });
  
    it("should get the latest listed token", async function () {
      const name = "test-sneaker";
      const description = "this is a test sneaker";
      const price = ethers.utils.parseEther("1");
      const tokenURI = "https://test-sneaker.com";
      await snykerContract.createToken(
        tokenURI,
        name,
        description,
        price,
        { value: price }
      );
  
      const tokenId = await snykerContract.getCurrentToken();
      const result = await snykerContract.getLatestIdToListedToken();
  
      expect(result.tokenId).to.equal(tokenId);
      expect(result.name).to.equal(name);
      expect(result.description).to.equal(description);
      expect(result.owner).to.equal(accounts[0].address);
      expect(result.price).to.equal(price);
      expect(result.firstSale).to.equal(true);
      expect(result.isInSale).to.equal(true);
    });
  
    it("should get a token for a given tokenId", async function () {
      const name = "test-sneaker";
      const description = "this is a test sneaker";
      const price = ethers.utils.parseEther("1");
      const tokenURI = "https://test-sneaker.com";
      await snykerContract.createToken(
        tokenURI,
        name,
        description,
        price,
        { value: price }
      );
  
      const tokenId = await snykerContract.getCurrentToken();
      const result = await snykerContract.getListedTokenForId(tokenId);
  
      expect(result.tokenId).to.equal(tokenId);
      expect(result.name).to.equal(name);
      expect(result.description).to.equal(description);
      expect(result.owner).to.equal(accounts[0].address);
      expect(result.price).to.equal(price);
      expect(result.firstSale).to.equal(true);
      expect(result.isInSale).to.equal(true);
    });
})