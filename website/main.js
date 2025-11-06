// CleanSpark - Official Reown AppKit Integration
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
  name: 'CleanSpark',
  description: 'CleanSpark Rewards Platform with Auto Rewards',
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
window.openConnectModal = () => {
    try {
        console.log('openConnectModal called, modal:', modal)
        if (modal && typeof modal.open === 'function') {
            console.log('Opening modal...')
            modal.open()
        } else {
            console.error('Modal not ready, waiting...')
            setTimeout(() => {
                if (modal && typeof modal.open === 'function') {
                    console.log('Opening modal after delay...')
                    modal.open()
                } else {
                    console.error('Modal still not ready')
                    alert('Please wait for wallet connection to initialize...')
                }
            }, 500)
        }
    } catch (error) {
        console.error('Error opening modal:', error)
        alert('Error connecting wallet: ' + error.message)
    }
}

// Also make modal itself available globally
window.modal = modal

// Mark modal as ready
window.walletModalReady = true

window.openNetworkModal = () => {
    try {
        if (modal && typeof modal.open === 'function') {
            modal.open({ view: 'Networks' })
        }
    } catch (error) {
        console.error('Error opening network modal:', error)
    }
}

// Also export as openWalletModal for compatibility
// Update the placeholder function with the real one
window.openWalletModal = window.openConnectModal

console.log('✅ Reown AppKit initialized successfully!')
console.log('✅ Modal object:', modal)
console.log('✅ openConnectModal function:', typeof window.openConnectModal)
console.log('✅ openWalletModal function:', typeof window.openWalletModal)
console.log('✅ window.modal:', window.modal)



