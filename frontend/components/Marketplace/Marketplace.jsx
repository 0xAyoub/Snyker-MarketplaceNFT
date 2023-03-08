
import { Flex, Textarea, Text, Box, Heading, Center, Input, Divider, Button, Grid, CircularProgress, Image } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import { Sneaker } from "../Sneaker/Sneaker"
import axios from "axios";


export const Marketplace = () => {

    const dataDefault = [
        {
            "name": "AirJordan x Dior",
            "image":"https://cdn.shopify.com/s/files/1/2358/2817/products/air-jordan-1-retro-high-travis-scott-cactus-jack-218526_1200x.png?v=1638813024",
            "price":"0.03ETH",
        },
        {
            "name": "AirJordan x Dior",
            "image":"https://cdn.shopify.com/s/files/1/2358/2817/products/air-jordan-1-retro-high-travis-scott-cactus-jack-218526_1200x.png?v=1638813024",
            "price":"0.5ETH",
        },
        {
            "name": "AirJordan x Travis Scott",
            "image":"https://cdn.shopify.com/s/files/1/2358/2817/products/air-jordan-1-retro-high-travis-scott-cactus-jack-218526_1200x.png?v=1638813024",
            "price":"0.2ETH",
        },
        {
            "name": "AirJordan x Travis Scott",
            "image":"https://cdn.shopify.com/s/files/1/2358/2817/products/air-jordan-1-retro-high-travis-scott-cactus-jack-218526_1200x.png?v=1638813024",
            "price":"0.2ETH",
        },
    ];

    const [data, updateData] = useState(dataDefault);
    const [dataFetched, updateFetched] = useState(false);
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const lastBlock = process.env.NEXT_PUBLIC_BLOCK



    async function getAllNFTs() {
        const ethers = require("ethers");

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(contractAddress, Contract.abi, signer)

        let transaction = await contract.getAllNFTs()
        let transactionInSale = []

        for(var i = 0; i < transaction.length; i++){

            if(transaction[i].tokenId.toString() != 0){
                transactionInSale.push(transaction[i])
            }
        }
    
        const items = await Promise.all(transactionInSale.map(async i => {
            try {

                    console.log(i)
                    const tokenURI = await contract.tokenURI(i.tokenId);
                    let meta = await axios.get(tokenURI);
                    meta = meta.data;
                    
                        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            
                        let item = {
                            tokenId: i.tokenId.toNumber(),
                            name: meta.name,
                            description: meta.description,
                            owner: i.owner,
                            price,
                            image: meta.image,
                            isInSale: i.isInSale.toString()
                        }
                        
                        return item;

            } catch (e) {
                console.log(e)
            }
           
        }))
        
        updateFetched(true);
        updateData(items);
    }
    
    if(!dataFetched)
        getAllNFTs();
    
console.log(data)

    return (
        <>
            <Flex display="block" marginLeft="30px" marginRight="30px" marginBottom="30px">

                    <Heading marginTop="50px" marginLeft="15px">Marketplace</Heading>
                    
                    <Grid templateColumns='repeat(4, 1fr)' gap={10}>
                    { 
                        data? (
                            
                                data.map((value, index) => {
                                    return(
                                        <Sneaker data={value} key={index}></Sneaker>
                                    ) 
                                })
                        ) : (
                            dataDefault.map((value, index) => {
                                return (
                                    <Sneaker data={value} key={index}></Sneaker>
                                    
                                )
                            })
                        )
                    }

                    </Grid>
            </Flex>
        </>
    )
}
