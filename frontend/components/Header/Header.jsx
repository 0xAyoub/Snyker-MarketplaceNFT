import { Flex, Heading, Text, Button, Divider } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
    return(
        <Flex paddingRight="10px" paddingLeft="10px" justifyContent="space-between" bg="black" color="white">
            <Flex justifyContent="space-between" margin="20px">
            <a href="/"> <Heading>Snyker</Heading> </a>
            {/*<a href="/release"><Text margin="13px" marginLeft="60px" fontSize="17px">Release</Text></a>*/}
            <a href="/release"><Text margin="13px" marginLeft="60px" fontSize="17px">Release</Text></a>
            <a href="/resell"><Text margin="13px" marginLeft="20px" fontSize="17px">Resell</Text></a>
            <a href="/wallet"><Text margin="13px" marginLeft="20px" fontSize="17px">Wallet</Text></a>
            </Flex>

            <Flex margin="20px">
                <a href="/Release"><Button colorScheme="blue" padding="20px" marginRight="10px" margin="5px">
                Buy
                </Button></a>
                <a href="/sell"><Button colorScheme="facebook"  marginRight="10px" margin="5px">
                Sell
                </Button></a>
                <ConnectButton/>

                
                
            </Flex>
         </Flex>
    )
}