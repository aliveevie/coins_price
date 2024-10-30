'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'

export default function PolygonPriceChecker() {
  const [price, setPrice] = useState<string | null>(null)
  const { isConnected } = useAccount()

  const fetchPolygonPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
      const data = await response.json()
      setPrice(data['matic-network'].usd.toFixed(2))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchPolygonPrice()
    }
  }, [isConnected])

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      {isConnected ? (
        price && <p className="text-4xl font-bold">${price}</p>
      ) : (
        <p className="text-lg text-muted-foreground">Please connect your wallet to see the price</p>
      )}
      <ConnectKitButton />
    </div>
  )
}