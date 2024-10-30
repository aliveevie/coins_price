'use client'

import { useState, useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { web3Config, polygonZkEvmCardona } from '../config/web3Config'
import { WagmiConfig } from 'wagmi'

export default function PolygonPriceChecker() {
  const [price, setPrice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const fetchPolygonPrice = async () => {
    if (!isConnected || chainId !== polygonZkEvmCardona.id) return
    
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
    if (isConnected && chainId === polygonZkEvmCardona.id) {
      fetchPolygonPrice()
    } else {
      setPrice(null)
    }
  }, [isConnected, chainId])

  return (
    <WagmiConfig config={web3Config}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Polygon (MATIC) Price Checker</CardTitle>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <ConnectKitButton />
            ) : chainId !== polygonZkEvmCardona.id ? (
              <Button onClick={() => switchChain({ chainId: polygonZkEvmCardona.id })} className="w-full">
                Switch to Polygon zkEVM Cardona
              </Button>
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
            {address && (
              <p className="mt-4 text-center text-sm text-gray-500">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </WagmiConfig>
  )
}