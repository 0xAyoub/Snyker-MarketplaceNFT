import { Flex, Input, Box, Text, Button, Image, Center } from "@chakra-ui/react"
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import axios from "axios";



export const SneakerWallet = (data) => {
    const newTo = {
        pathname:"/"+data.data.tokenId
    }
   
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const lastBlock = process.env.NEXT_PUBLIC_BLOCK

    const [price, setPrice] = useState('');

    const sellSneaker = async() => {
        try {
         
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)

            let priceInEther = price
            const priceMarket = ethers.utils.parseUnits("100000000000000", 2);

            let tx = await contract.sellSneaker(data.data.tokenId, priceInEther, {value: priceMarket})
            await tx.wait()

    
        } catch (e) {
            console.log(e)
        }

    }


    return (

        <>

                <Box justifyContent="space-between" borderWidth="2px" borderRadius="50px" marginTop="30px"  height="93%" padding="30px" width="20vw">
                                        
                    <Center display="block" marginBottom="20px">
                        {/* <Text fontWeight="600" fontSize="20px">{data.data.tokenId}</Text> */}
                        <Text fontWeight="600" fontSize="20px">{data.data.name}</Text>
                        <Image src={data.data.image} htmlHeight='200px' htmlWidth="200px"></Image>
                        <Text marginTop="20px" fontWeight="500" fontSize="17px">Description :</Text><Text fontWeight="400" fontSize="14px">{data.data.description}</Text>

                    </Center>

                    <Box marginTop="10px">
                        <Text fontWeight="500" fontSize="15px" >Prix de vente : {data.data.price} ETH + Market price : 0.01 ether</Text>
                        <Input marginTop="10px" placeholder={data.data.price*1.5 + " ETH"}  onChange={(e) => setPrice(e.target.value)} />
                        <Button colorScheme="blue" marginTop="10px" width="100%" onClick={sellSneaker}>Vendre</Button>
                    </Box>



                </Box>

                </>

    )
}
