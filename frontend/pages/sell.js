import Head from 'next/head'
import { Header } from "@/components/Header/Header"
import { Sell } from "@/components/Sell/Sell" 
import { Footer } from '../components/Footer/Footer'

export default function SellPage() {
  return (
    <>
      <Head>
        <title>Snyker</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Header/>
    <Sell/>
    <Footer/>
    </>
  )
}
