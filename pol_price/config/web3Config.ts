import { createConfig, http } from 'wagmi'
import { getDefaultConfig } from 'connectkit'
import { polygonZkEvmCardona } from 'wagmi/chains'

export const web3Config = createConfig(
  getDefaultConfig({
    chains: [polygonZkEvmCardona],
    transports: {
      [polygonZkEvmCardona.id]: http(
        "https://polygonzkevm-cardona.g.alchemy.com/v2/jO7iiEdAJwT1OTZEGOi9W2v8zn_OeVTB"
      ),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
    appName: 'React to Web3 Bootcamp',
    appDescription: 'React to Web3 Bootcamp',
    appUrl: 'https://localhost:3000',
    appIcon: 'https://localhost:3000/dablclub-512x512.png',
  })
)

export { polygonZkEvmCardona }