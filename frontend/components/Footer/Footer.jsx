import { Flex, Heading, Text, Button, Divider } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import { Sneaker } from "../Sneaker/Sneaker"
import axios from "axios";
import ethers from "ethers"
// import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Footer = () => {

    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS



    const withdrawAll = async() => {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let contract = new ethers.Contract(contractAddress, Contract.abi, signer)
        let tx = await contract.withdrawAll()
        await tx.wait()

    }


    return(
        <Flex padding="20px" paddingRight="60px" paddingLeft="60px" justifyContent="space-between" bg="black" color="white">

            <Text margin="13px" fontSize="13px">Copyright 2023 - Ayoub Benouda</Text>


            <a href="/"> <Button colorScheme="red" onClick={withdrawAll} >Admin Withdraw</Button> </a>
         
         </Flex>
    )
}
