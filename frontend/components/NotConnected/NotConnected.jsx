import { Flex, Textarea, Text, Box, Heading, Center, Input, Divider, Button, Grid, CircularProgress, Image } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'

export const NotConnectedPage = () => {

    return (
        <>

                <Box marginTop="35vh" marginBottom="35vh">
                    <Center>
                        <Heading>⚠️ You must be connected ⚠️</Heading>
                    </Center>
                </Box>

        </>
    )
}