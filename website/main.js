// CleanSpark - Official Reown AppKit Integration
console.log('🔄 Starting Reown AppKit initialization...')

let modal, wagmiConfig

// Initialize AppKit asynchronously
(async function() {
    try {
        console.log('📦 Importing Reown AppKit modules...')
        const { createAppKit } = await import('@reown/appkit')
        const { bsc } = await import('@reown/appkit/networks')
        const { WagmiAdapter } = await import('@reown/appkit-adapter-wagmi')
        
        console.log('✅ Modules imported successfully')
        
        // Your Project ID from Reown Cloud
        const projectId = 'bfc83000af18c81213a1bbde25397fbf'
        
        // Set up networks (BSC Mainnet)
        const networks = [bsc]
        
        console.log('🔧 Configuring Wagmi adapter...')
        
        // Configure Wagmi adapter
        const wagmiAdapter = new WagmiAdapter({
            projectId,
            networks
        })
        
        console.log('✅ Wagmi adapter configured')
        
        // Configure metadata
        const metadata = {
            name: 'CleanSpark',
            description: 'CleanSpark Rewards Platform with Auto Rewards',
            url: window.location.origin,
            icons: ['https://files.reown.com/reown-social-card.png'] // You can add your own icon later
        }
        
        console.log('🔧 Creating AppKit modal...')
        
        // Create the modal
        modal = createAppKit({
            adapters: [wagmiAdapter],
            networks,
            metadata,
            projectId,
            features: {
                analytics: true // Optional
            }
        })
        
        console.log('✅ Modal created successfully:', modal)
        
        // Also get wagmiConfig for contract interactions
        wagmiConfig = wagmiAdapter.wagmiConfig
        
        console.log('✅ Wagmi config created:', wagmiConfig)
        
        // Make modal globally available immediately
        window.modal = modal
        window.walletModalReady = true
        
        // Set up global functions
        window.openConnectModal = () => {
            try {
                console.log('openConnectModal called, modal:', modal)
                if (modal && typeof modal.open === 'function') {
                    console.log('Opening modal...')
                    modal.open()
                } else {
                    console.error('Modal not ready')
                    alert('Wallet connection not ready. Please refresh the page.')
                }
            } catch (error) {
                console.error('Error opening modal:', error)
                alert('Error connecting wallet: ' + error.message)
            }
        }
        
        window.openWalletModal = window.openConnectModal
        
        window.openNetworkModal = () => {
            try {
                if (modal && typeof modal.open === 'function') {
                    modal.open({ view: 'Networks' })
                }
            } catch (error) {
                console.error('Error opening network modal:', error)
            }
        }
        
        console.log('✅ Reown AppKit fully initialized!')
        console.log('✅ Modal object:', modal)
        console.log('✅ openConnectModal function:', typeof window.openConnectModal)
        console.log('✅ window.modal:', window.modal)
        console.log('✅ walletModalReady:', window.walletModalReady)
        
    } catch (error) {
        console.error('❌ Error initializing Reown AppKit:', error)
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        })
        
        // Create fallback
        modal = null
        wagmiConfig = null
        window.walletModalReady = false
        
        window.openConnectModal = () => {
            alert('Wallet connection failed to initialize. Please refresh the page.\n\nError: ' + error.message)
        }
        
        window.openWalletModal = window.openConnectModal
        window.openNetworkModal = () => {
            alert('Wallet connection failed to initialize.')
        }
        
        console.error('❌ Wallet modal initialization failed!')
    }
})()

// Export modal and wagmiConfig (will be set asynchronously)
export { modal, wagmiConfig }
