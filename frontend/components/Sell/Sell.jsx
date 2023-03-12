import { Flex, Textarea, Text, Box, Heading, Center, Input, Button, useToast } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'
import { useState, useEffect } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Contract from "../../src/Snyker.json";
import { ethers } from 'ethers'

// import { useLocation } from "react-router";



export const Sell = () => {

    const [formParams, updateFormParams] = useState({ name: '', description: '', price: '', priceMarket: ''});
    const [fileURL, setFileURL] = useState(null);
    const [message, updateMessage] = useState('');
    const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS
    const toast = useToast()


    async function OnChangeFile(e) {
        var file = e.target.files[0];

        try {
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }


    async function uploadMetadataToIPFS() {
        const {name, description, price} = formParams;

        if( !name || !description || !price || !fileURL)
            return;

        const nftJSON = {
            name, description, price, image: fileURL
        }

        try {

            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function sellNFT(e) {
        e.preventDefault();

        try {
            const metadataURL = await uploadMetadataToIPFS();

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (upto 5 mins)")

            let contract = new ethers.Contract(contractAddress, Contract.abi, signer)

            let name = formParams.name
            name.toString()

            let description = formParams.description
            description.toString()

            let price = ethers.utils.parseUnits(formParams.price, 'ether')
            price = price.toString()
        
            
            // let priceMarket = ethers.utils.parseEther(formParams.priceMarket);
            // priceMarket = priceMarket.toString()
            const priceMarket = ethers.utils.parseUnits("100000000000000", 2);


            console.log(priceMarket)
            console.log(metadataURL)

            let tx = await contract.createToken(metadataURL, name, description, price, {value: priceMarket})
            toast({
                title: "La vente s'effectue, veuillez patienter",
                status: 'info',
                duration: 100000,
                isClosable: false,
            })
            await tx.wait()
            toast({
                title: "En vente ! Vous pouvez accéder à votre paire dans l'onglet Release",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })


            updateMessage("");
            updateFormParams({ name: '', description: '', price: ''});
            // window.location.replace("/release")
        }
        catch(e) {
            console.log( "Upload error"+e )
        }
    }

    
    return (
        <>
            <Flex display="block" marginLeft="25%" marginRight="25%" marginBottom="60px">
            <Center>

                <Heading marginTop="50px">Panel de vente</Heading>
            </Center>


                <Flex display="flex"  justify="space-between">

                    <Box borderWidth="2px" borderRadius="50px" marginTop="30px" height="100%" padding="30px" width="100%">

                    <Center>

                        <Text fontWeight="600" fontSize="30px">Vendre une paire de sneakers</Text>
                    </Center>



                    <Text fontWeight="400" fontSize="20px" marginTop="20px">Nom de la marque</Text>
                    <Input display="block"  onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name} placeholder="Air Jordan x OffWhite" marginTop="10px" width="100%"/>


                        <Text fontWeight="400" fontSize="20px" marginTop="20px">Image</Text>
                        <Input display="block" onChange={OnChangeFile} type="file" placeholder="Upload" width="100%"/>
                        


                        <Text fontWeight="400" fontSize="20px" marginTop="20px">Description</Text>
                        <Textarea display="block"  onChange={e => updateFormParams({...formParams, description: e.target.value})} value={formParams.description} placeholder="Une AirJordan 1 rouge et blanche avec la flèche OffWhite en édition limitée." marginTop="10px" width="100%"/>

                        <Text fontWeight="400" fontSize="20px" marginTop="20px">Prix (ETH)</Text>
                        <Input display="block"  onChange={e => updateFormParams({...formParams, price: e.target.value})} value={formParams.price} placeholder="200" marginTop="10px" width="100%"/>

                        {/* <Text fontWeight="400" fontSize="20px" marginTop="20px">Frais de commission (0.01 ETH)</Text>
                        <Input display="block" onChange={e => updateFormParams({...formParams, priceMarket: e.target.value})} value={formParams.priceMarket} placeholder="0.01" marginTop="10px" width="100%"/> */}


                        <Button onClick={sellNFT} fontWeight="400" marginTop="20px" colorScheme="blue">Vendre</Button>

                    </Box>

                </Flex>

            
            </Flex>

            
        </>
    )
}
