# Crypto Price Dashboard

A professional cryptocurrency price dashboard built with Next.js and Web3 technologies, featuring real-time price updates for Polygon (MATIC) and other major cryptocurrencies.

## Features

- 🔄 Real-time cryptocurrency price updates
- 💳 Web3 wallet integration with ConnectKit
- ⚡ Built on Polygon zkEVM Cardona network
- 📊 Featured display for Polygon (MATIC) prices
- 💰 Additional price tracking for Bitcoin, Ethereum, Solana, and BNB
- 🎨 Professional UI with Tailwind CSS and shadcn/ui
- 🌙 Responsive design for all devices

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Wagmi v2
- ConnectKit
- CoinGecko API

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Web3 wallet (like MetaMask)
- An Alchemy API key
- A WalletConnect Project ID

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id