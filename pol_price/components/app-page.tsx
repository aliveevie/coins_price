'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mumbaiConfig } from '../config/mumbai'

export function Page() {
  const [price, setPrice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const network = await provider.getNetwork()
        
        setAccount(address)
        setChainId(network.chainId)

        // Check if the connected network is Mumbai testnet
        if (network.chainId !== mumbaiConfig.chainId) {
          setError('Please connect to the Polygon Mumbai testnet')
        } else {
          setError(null)
          await fetchPolygonPrice()
        }
      } catch (err) {
        console.error('Failed to connect wallet:', err)
        setError('Failed to connect wallet')
      }
    } else {
      setError('Please install MetaMask')
    }
  }

  const fetchPolygonPrice = async () => {
    if (!account) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
      const data = await response.json()
      setPrice(data['matic-network'].usd.toFixed(2))
    } catch (err) {
      setError('Failed to fetch Polygon price')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null)
        setPrice(null)
      })
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16))
        setPrice(null)
      })
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Polygon (MATIC) Price Checker</CardTitle>
        </CardHeader>
        <CardContent>
          {!account ? (
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          ) : chainId !== mumbaiConfig.chainId ? (
            <p className="text-center text-red-500">Please connect to the Polygon Mumbai testnet</p>
          ) : loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : price ? (
            <>
              <p className="text-4xl font-bold text-center mb-4">${price}</p>
              <Button 
                onClick={fetchPolygonPrice} 
                className="w-full"
                disabled={loading}
              >
                Refresh Price
              </Button>
            </>
          ) : (
            <Button 
              onClick={fetchPolygonPrice} 
              className="w-full"
              disabled={loading}
            >
              Fetch Price
            </Button>
          )}
          {account && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}