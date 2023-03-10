import { Flex, Textarea, Text, Box, Heading, Center, Input, Divider, Button, Grid, CircularProgress, Image } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import { SneakerWallet } from "../SneakerWallet/SneakerWallet"
import axios from "axios";


export const Wallet = () => {

    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);

    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const lastBlock = process.env.NEXT_PUBLIC_BLOCK


    async function getMyNFTs() {
        const ethers = require("ethers");

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();

        let contract = new ethers.Contract(contractAddress, Contract.abi, signer)

        let transaction = await contract.getMyNFTs()

        let transactionInSale = []

        for(var i = 0; i < transaction.length; i++){

            if(transaction[i].tokenId.toString() != 0){
                transactionInSale.push(transaction[i])
            }
        }
    
        const items = await Promise.all(transactionInSale.map(async i => {

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
        }))
    
        updateFetched(true);
        updateData(items);
    }
    
    if(!dataFetched)
    getMyNFTs();
    


    return (
        <>
        {
            data.length !== 0 ? (
                <Flex display="block" marginLeft="30px" marginRight="30px" marginBottom="15vh" marginTop="5vh">
                <Flex justifyContent="space-between">
                    <Heading marginTop="65px" marginLeft="15px">Wallet</Heading>
                  
                </Flex>

                <Flex display="block" justifyContent="space-between" borderRadius="20px"  height="100%" padding="10px" width="100%">

                            <Grid templateColumns='repeat(4, 1fr)' gap={10}>
                                { 

                                        data.map((value, index) => {
                                            return (
                                                
                                                <SneakerWallet data={value} key={index}></SneakerWallet>
                                            
                                            )
                                        })

                                }
                                
                            </Grid>

                    </Flex>
            </Flex>
            ) : (
            <Flex display="block" marginLeft="30px" marginRight="30px" marginBottom="35vh" marginTop="35vh">
                <Flex flexDirection="column" alignItems="center">
                    <Heading marginLeft="15px">Wallet</Heading>
                    <Text fontWeight="500" fontSize="20px">⚠️ Vous n'avez aucune paire de sneakers, achetez-en ! ⚠️</Text>
                    <Box marginTop="15px">
                        <a href="/release"><Button marginRight="10px"  colorScheme="facebook">Minter une paire</Button></a>
                        <a href="/resell"><Button  marginLeft="10px" colorScheme="blue">Acheter une paire</Button></a>
                    </Box>
                </Flex>
            </Flex>
            )

        }
           
        </>
    )
}
