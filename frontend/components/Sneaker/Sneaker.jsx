import { Flex, Box, Text, Button, Image, Center } from "@chakra-ui/react"
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import axios from "axios";



export const Sneaker = (data) => {


   
    const [message, updateMessage] = useState('');
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const lastBlock = process.env.NEXT_PUBLIC_BLOCK



    const executeRelease = async() => {
        try {
         
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)

            let price = data.data.price
            price = ethers.utils.parseEther(price)
            price = price.toString()
            let tx = await contract.executeRelease(data.data.tokenId, {value: price})
            await tx.wait()

    
        } catch (e) {
            console.log(e)
        }

    }

    const executeSale = async() => {
        try {
         
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            console.log(data.data.tokenId)

            let price = data.data.price
            price = ethers.utils.parseEther(price)
            price = price.toString()
            let tx = await contract.executeSale(data.data.tokenId, {value: price})
            await tx.wait()

    
        } catch (e) {
            console.log(e)
        }

    }

    return (


        <>

                <Box justifyContent="space-between" borderWidth="2px" borderRadius="50px" marginTop="30px"  height="93%" padding="30px" width="20vw">
                                        
                    <Center display="block" marginBottom="20px">
                        <Text fontWeight="600" fontSize="20px">{data.data.tokenId}</Text>
                        <Text fontWeight="600" fontSize="20px">{data.data.name}</Text>
                        <Image src={data.data.image}></Image>
                    </Center>

                    <Box marginTop="10px">
                        <Text fontWeight="500" fontSize="15px" >{data.data.price} ETH</Text>
                        <Button colorScheme="blue" marginTop="10px" 
                            onClick={() => {
                                if (!data.data.firstSale) {
                                    executeRelease();
                                } else {
                                    executeSale();
                                }
                            }}
                        >
                            Acheter
                        </Button>
                    </Box>

                </Box>
       
                

                </>



           



    )
}