import Head from 'next/head'
import { Header } from "@/components/Header/Header"
import { Wallet } from "@/components/Wallet/Wallet"
import { Footer } from '../components/Footer/Footer'
import { NotConnectedPage } from '../components/NotConnected/NotConnected'
import { useAccount, useProvider, useSigner, useBalance  } from 'wagmi'

export default function WalletPage() {


  const isConnected = useAccount().isConnected


  return (
    <>
      <Head>
        <title>Snyker</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Header/>
    {
        isConnected ? (
          <Wallet/>
        ) : (
          <NotConnectedPage/>
        )
    }
    <Footer/>
    </>
  )
}
