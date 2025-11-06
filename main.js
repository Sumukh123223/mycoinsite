// DipenMali - Official Reown AppKit Integration
import { createAppKit } from '@reown/appkit'
import { bsc } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Your Project ID from Reown Cloud
const projectId = 'bfc83000af18c81213a1bbde25397fbf'

// Set up networks (BSC Mainnet)
const networks = [bsc]

// Configure Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// Configure metadata
const metadata = {
  name: 'DipenMali',
  description: 'DipenMali Rewards Platform with Auto Rewards',
  url: window.location.origin,
  icons: ['https://files.reown.com/reown-social-card.png'] // You can add your own icon later
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true // Optional
  }
})

// Also get wagmiConfig for contract interactions
export const wagmiConfig = wagmiAdapter.wagmiConfig

// Make modal globally available for HTML
window.openConnectModal = () => modal.open()
window.openNetworkModal = () => modal.open({ view: 'Networks' })

console.log('✅ Reown AppKit initialized successfully!')



