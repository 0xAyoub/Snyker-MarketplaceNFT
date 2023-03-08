const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------")
    arguments = []
    const Snyker = await deploy("Snyker", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmation: network.config.blockConfirmations
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN){
        log("Verifying...")
        await verify(Snyker.address, arguments)
    }
}

module.exports.tags = ["all", "Snyker", "main"]