'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { polygonZkEvmCardona } from 'wagmi/chains';
import { http } from 'viem';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygonZkEvmCardona],
    transports: {
      // RPC URL for each chain
      [polygonZkEvmCardona.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
    },
    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
    // Required App Info
    appName: 'React to Web3 Bootcamp',
    // Optional App Info
    appDescription: 'React to Web3 Bootcamp',
    appUrl: 'https://localhost:3000', // your app's url
    appIcon: 'https://localhost:3000/dablclub-512x512.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}