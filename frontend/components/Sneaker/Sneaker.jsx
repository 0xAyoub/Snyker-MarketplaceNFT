import { Flex, Box, Text, Button, Image, Center, useToast } from "@chakra-ui/react"
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import axios from "axios";



export const Sneaker = (data) => {


   console.log(data)
    const [message, updateMessage] = useState('');
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const lastBlock = process.env.NEXT_PUBLIC_BLOCK
    const toast = useToast()

    const executeRelease = async() => {
        try {
         
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)

            let price = data.data.price
            let priceInWei = ethers.utils.parseEther(price)
            priceInWei = priceInWei.toString()
            let tx = await contract.executeRelease(data.data.tokenId, {value: priceInWei})
            await tx.wait()

            toast({
                title: 'Achat réussi',
                description: "Vous l'avez acheté à : " + price + " ETH",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
 
        } catch (e) {
            toast({
                title: "Achat échoué",
                description: e.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }

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

    const deleteSneakers = async() => {
        try {
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)

            let tx = await contract.deleteSneakers(data.data.tokenId)
            await tx.wait()

            toast({
                title: 'Suppression réussi',
                description: "Vous avez supprimé la paire de sneakers " + data.data.name,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            
        } catch(e) {
            console.log(e.message)
        }
    }

    const executeSale = async() => {
        try {
         
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, Contract.abi, signer)
            console.log(data.data.tokenId)

            // let price = data.data.price
            // price = ethers.utils.parseEther(price)
            // price = price.toString()
            // let tx = await contract.executeSale(data.data.tokenId, {value: price})
            // await tx.wait()

            let price = data.data.price
            let priceInWei = ethers.utils.parseEther(price)
            priceInWei = priceInWei.toString()
            let tx = await contract.executeSale(data.data.tokenId, {value: priceInWei})
            await tx.wait()

            toast({
                title: 'Achat réussi',
                description: "Vous l'avez acheté à : " + price + " ETH",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
    
        } catch (e) {
            console.log(e)
            toast({
                title: "Achat échoué",
                description: e.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }

    }

    return (

        <>
                        {console.log(data.data)}
            {data.data ? (

                <Box justifyContent="space-between" borderWidth="2px" borderRadius="50px" marginTop="30px"  height="93%" padding="30px" width="20vw">
                                        
                    <Center display="block" marginBottom="20px">
                        {/* <Text fontWeight="600" fontSize="20px">{data.data.tokenId}</Text> */}
                        <Text fontWeight="700" fontSize="20px">{data.data.name}</Text>
                        <Image src={data.data.image} htmlHeight='200px' htmlWidth="200px"></Image>
                        <Text marginTop="20px" fontWeight="500" fontSize="17px">Description :</Text><Text fontWeight="400" fontSize="14px">{data.data.description}</Text>

                    </Center>


                    <Box marginTop="10px">
                        <Text fontWeight="500" fontSize="15px" >Prix : {data.data.price} ETH</Text>

                        {/* {

                            data.data.firstSale === true ? (

                                <Button colorScheme="blue" marginTop="10px" onClick={() => {console.log("executeRelease"); executeRelease()}}>
                                    Acheter
                                    </Button>
                            ) : (

                                <Button colorScheme="blue" marginTop="10px" onClick={() => {console.log("executeSale"); executeSale()}}>
                                    Acheter
                                    </Button>

                            )

                        } */}

                        <Button colorScheme="blue" marginTop="10px" onClick={() => {
                            if (data.data.firstSale === "true") {
                                console.log("firstSale");
                                executeRelease();
                            } if(data.data.firstSale === "false") {
                                console.log("not a FirstSale");
                                executeSale();
                            } else {
                                console.log(data.data.firstSale)
                            }
                        }}>
                            Acheter
                        </Button>

                        {

                            useAccount().address == admin ? (

                                <Button colorScheme="red" marginTop="10px" marginLeft="10px" onClick={() => deleteSneakers()}>Delete</Button>
                            ) : (
                                <></>
                            )

                        }

                    </Box>

                </Box>
       
                
            ) : (
 
                <Box justifyContent="space-between" borderWidth="2px" borderRadius="50px" marginTop="30px"  height="93%" padding="30px" width="20vw">
                                        
                <Center display="block" marginBottom="20px">
                    {/* <Text fontWeight="600" fontSize="20px">{data.data.tokenId}</Text> */}
                    <Text fontWeight="700" fontSize="20px">Paire de sneakers par défaut ⚠️</Text>
                    <Image src="https://cdn.shopify.com/s/files/1/2358/2817/products/air-jordan-1-retro-high-travis-scott-cactus-jack-218526_1200x.png?v=1638813024" htmlHeight='200px' htmlWidth="200px"></Image>
                    <Text marginTop="20px" fontWeight="500" fontSize="17px">Description :</Text><Text fontWeight="400" fontSize="14px">Les données n'ont pas encore transitées, veuillez réessayer plus tard.</Text>

                </Center>


                <Box marginTop="10px">
                    <Text fontWeight="500" fontSize="15px" >Prix : 0 ETH</Text>

                    <Button colorScheme="blue" marginTop="10px">
                        Acheter
                    </Button>
                </Box>
            </Box>


            )}

                </>



           



    )
}
