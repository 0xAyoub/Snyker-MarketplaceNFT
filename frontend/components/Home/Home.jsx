import { Flex, Textarea, Text, Box, Heading, Center, Input, Divider, Button, Grid, CircularProgress, Image } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'

export const HomePage = () => {


    return (
        <>
        {
                <Box marginTop="15%" marginBottom="15%">
                    <Center display="block">
                        <Text  textAlign="center" fontSize="50px" fontWeight="700" >The 1st marketplace without theft, and scams.</Text>
                    </Center>
                    <Flex justify="center">
                        <a href="/marketplace"><Button colorScheme="blue" marginRight="7px" padding="30px">
                        <Text fontWeight="600" fontSize="17px">Buy a sneaker</Text>
                        </Button></a>
                        <a href="/sell"><Button colorScheme="facebook" marginLeft="7px" padding="30px">
                        <Text fontWeight="600" fontSize="17px">Sell a sneaker</Text>
                        </Button></a>
                    </Flex>
                </Box>

        }
        </>
    )
}