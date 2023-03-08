import { Flex, Textarea, Text, Box, Heading, Center, Input, Divider, Button, Grid, CircularProgress, Image } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'

export const NotConnectedPage = () => {

    return (
        <>

                <Box marginTop="18%" marginBottom="18%">
                    <Center>
                        <Heading>⚠️ You should to be connected ⚠️</Heading>
                    </Center>
                </Box>

        </>
    )
}