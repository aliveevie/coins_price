'use client'

import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bitcoin, Hexagon, CircleDollarSign, Coins, Wallet, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface CryptoPrice {
  id: string
  name: string
  price: string
  icon: React.ComponentType
  isPrimary?: boolean
}

export default function CryptoPriceDashboard() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(false)
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const fetchCryptoPrices = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=matic-network,bitcoin,ethereum,solana,binancecoin&vs_currencies=usd'
      )
      const data = await response.json()
      
      setPrices([
        { 
          id: 'matic-network', 
          name: 'Polygon', 
          price: data['matic-network'].usd.toFixed(2), 
          icon: Hexagon,
          isPrimary: true
        },
        { id: 'bitcoin', name: 'Bitcoin', price: data['bitcoin'].usd.toFixed(2), icon: Bitcoin },
        { id: 'ethereum', name: 'Ethereum', price: data['ethereum'].usd.toFixed(2), icon: Coins },
        { id: 'solana', name: 'Solana', price: data['solana'].usd.toFixed(2), icon: CircleDollarSign },
        { id: 'binancecoin', name: 'BNB', price: data['binancecoin'].usd.toFixed(2), icon: Wallet }
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchCryptoPrices()
      const interval = setInterval(fetchCryptoPrices, 30000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
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
      </div>
    )
  }

  const polygonPrice = prices.find(p => p.id === 'matic-network')
  const otherPrices = prices.filter(p => p.id !== 'matic-network')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Polygon Featured Card */}
        {loading && !prices.length ? (
          <Card className="backdrop-blur-sm bg-background/95 max-w-2xl mx-auto">
            <CardHeader className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-48" />
            </CardHeader>
          </Card>
        ) : polygonPrice && (
          <Card className="backdrop-blur-sm bg-[#8247E5]/10 border-[#8247E5] max-w-2xl mx-auto hover:scale-105 transition-transform">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Hexagon className="h-8 w-8 text-[#8247E5]" />
                <CardTitle className="text-3xl">Polygon</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-[#8247E5]">
                  ${Number(polygonPrice.price).toLocaleString()}
                </span>
                <span className="text-muted-foreground">USD</span>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Other Cryptocurrencies */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading && !prices.length ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="backdrop-blur-sm bg-background/95">
                <CardHeader className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </CardHeader>
              </Card>
            ))
          ) : (
            otherPrices.map((crypto) => (
              <Card 
                key={crypto.id} 
                className="backdrop-blur-sm bg-background/95 transition-transform hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                  <span className="h-5 w-5">
                     <crypto.icon />
                  </span>

                    <CardTitle className="text-xl">{crypto.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight">
                      ${Number(crypto.price).toLocaleString()}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Disconnect Button */}
        <div className="flex justify-center pt-8">
          <Button 
            variant="outline" 
            onClick={() => disconnect()}
            className="flex items-center gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </div>
  )
}