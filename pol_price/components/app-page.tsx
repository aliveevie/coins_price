'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'

export default function PolygonPriceChecker() {
  const [price, setPrice] = useState<string | null>(null)
  const { isConnected } = useAccount()

  const fetchPolygonPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polygon-pos&vs_currencies=usd')
      const data = await response.json()
      console.log(data)
      setPrice(data['polygon-pos'].usd.toFixed(2))
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
      {price && <p className="text-4xl font-bold">${price}</p>}
      <ConnectKitButton />
    </div>
  )
}