import { Flex, Heading, Container, Text, Button, Divider } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import { Sneaker } from "../Sneaker/Sneaker"
import axios from "axios";
// import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Footer = () => {

    
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const ethers = require("ethers");


    const withdrawAll = async() => {
       
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(contractAddress, Contract.abi, signer)
        let tx = await contract.withdrawAll()
        await tx.wait()

    }


    const [admin, getAdmin] = useState()
    const setAdmin = async() => {
        const ethers = require("ethers");

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();


        let contract = new ethers.Contract(contractAddress, Contract.abi, provider)

        let tx = await contract.admin()

        getAdmin(tx)

    }
    setAdmin()

    return(
        <Flex display="flex" as="footer" padding="20px" margin="0" width="100%" paddingRight="60px" paddingLeft="60px" justifyContent="space-between" bg="black" color="white">

            <Text marginTop="13px" marginBottom="13px" fontSize="13px">Copyright 2023 - Ayoub Benouda</Text>

            {
            
            useAccount().address == admin ? (
                <a href="/"> <Button colorScheme="red" onClick={withdrawAll} >Admin Withdraw</Button> </a>
            ) : (
                <></>
            )
            
            }
     
         </Flex>
    )
}
