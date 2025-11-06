// CleanSpark - Official Reown AppKit Integration
console.log('🔄 Starting Reown AppKit initialization...')

let modal, wagmiConfig

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
    
    console.log('✅ Global wallet functions set up')
    
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
}

export { modal, wagmiConfig }

// Make modal globally available for HTML
// Wait for modal to be initialized
if (modal) {
    console.log('✅ Modal available, setting up global functions...')
    
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
    
    // Also make modal itself available globally
    window.modal = modal
    
    // Mark modal as ready
    window.walletModalReady = true
    
    console.log('✅ Global wallet functions set up')
} else {
    console.error('❌ Modal not initialized!')
    window.openConnectModal = () => {
        alert('Wallet connection failed to initialize. Please refresh the page.')
    }
    window.walletModalReady = false
}

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



