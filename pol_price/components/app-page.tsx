'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bitcoin, Wallet } from 'lucide-react'
import { EtherSymbol } from 'ethers'

interface CryptoPrice {
  id: string
  name: string
  price: string
  icon: React.ComponentType
  change24h?: string
}

export default function CryptoPriceDashboard() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(false)
  const { isConnected } = useAccount()

  const fetchCryptoPrices = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=matic-network,bitcoin,ethereum,solana,binancecoin&vs_currencies=usd'
      )
      const data = await response.json()
      
      const cryptoList: CryptoPrice[] = [
        { id: 'matic-network', name: 'Polygon', price: data['matic-network'].usd.toFixed(2), icon: Wallet },
        { id: 'bitcoin', name: 'Bitcoin', price: data['bitcoin'].usd.toFixed(2), icon: Bitcoin },
        { id: 'ethereum', name: 'Ethereum', price: data['ethereum'].usd.toFixed(2), icon: EtherSymbol },
        { id: 'solana', name: 'Solana', price: data['solana'].usd.toFixed(2), icon: Wallet },
        { id: 'binancecoin', name: 'BNB', price: data['binancecoin'].usd.toFixed(2), icon: Wallet },
      ]
      
      setPrices(cryptoList)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchCryptoPrices()
      const interval = setInterval(fetchCryptoPrices, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isConnected])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight lg:text-6xl mb-4">
            Crypto Market Prices
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time cryptocurrency prices from the market's top performers.
            Connect your wallet to start tracking.
          </p>
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Connect Wallet to View Prices</CardTitle>
              <CardDescription>
                Get real-time access to the latest cryptocurrency prices
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ConnectKitButton />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {loading && !prices.length ? (
              Array(5).fill(0).map((_, i) => (
                <Card key={i} className="backdrop-blur-sm bg-background/95">
                  <CardHeader className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </CardHeader>
                </Card>
              ))
            ) : (
              prices.map((crypto) => (
                <Card 
                  key={crypto.id} 
                  className="backdrop-blur-sm bg-background/95 transition-transform hover:scale-105"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <crypto.icon className="h-5 w-5" />
                      <CardTitle className="text-xl">{crypto.name}</CardTitle>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight">
                        ${Number(crypto.price).toLocaleString()}
                      </span>
                      {crypto.change24h && (
                        <span className={`text-sm ${
                          Number(crypto.change24h) >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {crypto.change24h}%
                        </span>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}