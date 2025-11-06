// CleanSpark - Professional Mining Platform
import { modal, wagmiConfig } from './main.js'
import { readContract, writeContract, getAccount, watchAccount, waitForTransactionReceipt } from '@wagmi/core'

// Contract Configuration
const CONTRACT_ADDRESS = '0x45CbCA5f88c510526049F31cECeF626Eb5254784'
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955' // USDT on BSC

// USDT ERC20 ABI (minimal)
const USDT_ABI = [
    {
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    }
]

const CONTRACT_ABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'calculateRewards',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'getUserHoldings',
        outputs: [
            { name: 'lockedAmount', type: 'uint256' },
            { name: 'earnedRewards', type: 'uint256' },
            { name: 'totalBalance', type: 'uint256' },
            { name: 'pendingRewards', type: 'uint256' },
            { name: 'lockEnd', type: 'uint256' },
            { name: 'isLocked', type: 'bool' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'claimRewards',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    // Referral functions
    {
        inputs: [{ name: 'referrer', type: 'address' }],
        name: 'registerReferral',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ name: 'usdtAmount', type: 'uint256' }],
        name: 'buyTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { name: 'usdtAmount', type: 'uint256' },
            { name: 'referrer', type: 'address' }
        ],
        name: 'buyTokensWithReferral',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'buyTokensWithBNB',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [{ name: 'referrer', type: 'address' }],
        name: 'buyTokensWithBNBAndReferral',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'bnbToUsdtRate',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ name: 'user', type: 'address' }],
        name: 'getReferralInfo',
        outputs: [
            { name: 'referrer', type: 'address' },
            { name: 'totalEarnings', type: 'uint256' },
            { name: 'count', type: 'uint256' },
            { name: 'totalVolume', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ name: 'user', type: 'address' }],
        name: 'hasReferrer',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    }
]

let updateInterval = null
let currentAddress = null
let isUpdating = false
let reconnectAttempts = 0
let isManualDisconnect = false
const MAX_RECONNECT_ATTEMPTS = 3
const UPDATE_INTERVAL = 10000 // 10 seconds
const RETRY_DELAY = 5000 // 5 seconds

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 CleanSpark App loaded')
    
    // Setup modal button click handlers
    setupModalButtons()
    
    // Setup claim button
    setupClaimButton()
    
    // Setup contact form
    setupContactForm()
    
    // Setup referral system
    setupReferralSystem()
    
    // Setup buy functions
    setupBuyFunctions()
    
    // Setup MetaMask browser detection and auto-add
    setupMetaMaskBrowserFeatures()
    
    // Setup smooth scrolling
    setupSmoothScrolling()
    
    // Setup animations
    setupAnimations()
    
    // Single watch instance
    watchAccount(wagmiConfig, {
        onConnect(data) {
            if (isManualDisconnect) {
                console.log('⚠️ Manual disconnect active - ignoring connection')
                return
            }
            console.log('✅ Wallet connected:', data.address)
            reconnectAttempts = 0 // Reset on successful connection
            handleAccountChange(data.address)
        },
        onDisconnect() {
            if (isManualDisconnect) {
                console.log('⚠️ Manual disconnect - ignoring auto-disconnect')
                return
            }
            console.log('🔌 Wallet disconnected')
            handleDisconnect()
        },
        onChange(data) {
            if (isManualDisconnect) {
                console.log('⚠️ Manual disconnect active - ignoring change')
                return
            }
            if (data.address && data.address !== currentAddress) {
                console.log('📝 Account changed:', data.address)
                handleAccountChange(data.address)
            } else if (!data.address && currentAddress) {
                handleDisconnect()
            }
        }
    })
    
    // Check if already connected on load
    try {
        const account = getAccount(wagmiConfig)
        if (account.address) {
            console.log('🔗 Found existing connection:', account.address)
            handleAccountChange(account.address)
        }
    } catch (error) {
        console.error('Error checking connection:', error)
    }
})

// Handle account connection
function handleAccountChange(address) {
    if (currentAddress === address) {
        console.log('⚠️ Already connected to this address')
        return
    }
    
    // Reset manual disconnect flag when connecting
    isManualDisconnect = false
    
    currentAddress = address
    
    // Show connected UI
    const walletBtn = document.getElementById('walletConnectBtn')
    const walletInfo = document.getElementById('walletInfo')
    const walletAddress = document.getElementById('walletAddress')
    const notConnected = document.getElementById('notConnected')
    const connectedDashboard = document.getElementById('connectedDashboard')
    
    // Buy section UI
    const buyNotConnected = document.getElementById('buyNotConnected')
    const buyConnected = document.getElementById('buyConnected')
    
    if (walletBtn) walletBtn.style.display = 'none'
    if (walletInfo) walletInfo.style.display = 'flex'
    if (notConnected) notConnected.style.display = 'block'
    if (connectedDashboard) connectedDashboard.style.display = 'block'
    if (walletAddress) walletAddress.textContent = address.slice(0, 6) + '...' + address.slice(-4)
    
    // Update buy section
    if (buyNotConnected) buyNotConnected.style.display = 'none'
    if (buyConnected) buyConnected.style.display = 'block'
    
    // Check for referral
    const referrer = getReferrerAddress()
    if (referrer) {
        const referralInfo = document.getElementById('referralInfo')
        if (referralInfo) referralInfo.style.display = 'block'
    }
    
    // Start updating dashboard
    if (updateInterval) clearInterval(updateInterval)
    updateDashboard(address)
    updateInterval = setInterval(() => updateDashboard(address), UPDATE_INTERVAL)
    
    // Update referral display
    updateReferralDisplay()
    
    console.log('✅ Dashboard started for:', address)
}

// Handle wallet disconnect
function handleDisconnect() {
    currentAddress = null
    
    // Clear interval
    if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
    }
    
    // Set manual disconnect flag to prevent auto-reconnect
    isManualDisconnect = true
    
    // Update UI
    const walletBtn = document.getElementById('walletConnectBtn')
    const walletInfo = document.getElementById('walletInfo')
    const notConnected = document.getElementById('notConnected')
    const connectedDashboard = document.getElementById('connectedDashboard')
    
    // Buy section UI
    const buyNotConnected = document.getElementById('buyNotConnected')
    const buyConnected = document.getElementById('buyConnected')
    
    if (walletBtn) walletBtn.style.display = 'block'
    if (walletInfo) walletInfo.style.display = 'none'
    if (notConnected) notConnected.style.display = 'block'
    if (connectedDashboard) connectedDashboard.style.display = 'none'
    
    // Update buy section
    if (buyNotConnected) buyNotConnected.style.display = 'block'
    if (buyConnected) buyConnected.style.display = 'none'
    
    console.log('🔌 Dashboard stopped')
}

// Update dashboard with retry logic
async function updateDashboard(address, retryCount = 0) {
    if (!address || address !== currentAddress) {
        console.log('⚠️ Skipping update - wrong address')
        return
    }
    
    if (isUpdating) {
        console.log('⚠️ Update already in progress')
        return
    }
    
    isUpdating = true
    
    try {
        console.log('📊 Updating dashboard for:', address)
        
        // Read decimals first
        const decimals = await readContract(wagmiConfig, {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'decimals',
            args: []
        })
        
        // Read all data in parallel
        const [balance, holdings, pendingRewards] = await Promise.all([
            readContract(wagmiConfig, {
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'balanceOf',
                args: [address]
            }),
            readContract(wagmiConfig, {
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'getUserHoldings',
                args: [address]
            }),
            readContract(wagmiConfig, {
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'calculateRewards',
                args: [address]
            })
        ])
        
        // Format function
        const formatToken = (amount) => {
            const divisor = BigInt(10 ** Number(decimals))
            const whole = amount / divisor
            const decimal = amount % divisor
            const decimals_str = decimal.toString().padStart(Number(decimals), '0').replace(/0+$/, '') || '0'
            return decimals_str === '0' ? whole.toString() : `${whole}.${decimals_str.substring(0, 4)}`
        }
        
        // Update UI elements
        const userBalance = document.getElementById('userBalance')
        const pendingRewardsEl = document.getElementById('pendingRewards')
        const lockedAmount = document.getElementById('lockedAmount')
        const lockStatus = document.getElementById('lockStatus')
        
        if (userBalance) {
            userBalance.textContent = formatToken(balance) + ' CleanSpark'
        }
        
        if (pendingRewardsEl) {
            pendingRewardsEl.textContent = formatToken(pendingRewards) + ' CleanSpark'
        }
        
        if (lockedAmount) {
            lockedAmount.textContent = formatToken(holdings.lockedAmount) + ' CleanSpark'
        }
        
        if (lockStatus) {
            if (holdings.isLocked) {
                const lockEnd = Number(holdings.lockEnd) * 1000
                const now = Date.now()
                
                if (lockEnd > now) {
                    const minutesLeft = Math.ceil((lockEnd - now) / (1000 * 60))
                    lockStatus.textContent = `${minutesLeft} min(s) left`
                } else {
                    lockStatus.textContent = 'Unlocking...'
                }
            } else {
                lockStatus.textContent = 'All unlocked'
            }
        }
        
        // Reset retry counter on success
        reconnectAttempts = 0
        
        console.log('✅ Dashboard updated successfully')
        
    } catch (error) {
        console.error('❌ Error updating dashboard:', error)
        
        // Retry logic
        if (retryCount < MAX_RECONNECT_ATTEMPTS) {
            console.log(`🔄 Retrying update... (${retryCount + 1}/${MAX_RECONNECT_ATTEMPTS})`)
            setTimeout(() => updateDashboard(address, retryCount + 1), RETRY_DELAY)
        } else {
            console.error('❌ Max retries reached')
            // Show error to user
            const pendingRewardsEl = document.getElementById('pendingRewards')
            if (pendingRewardsEl) {
                pendingRewardsEl.textContent = 'Loading...'
            }
        }
    } finally {
        isUpdating = false
    }
}

// Setup modal buttons
function setupModalButtons() {
    const connectBtn = document.getElementById('walletConnectBtn')
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            modal.open()
        })
    }
}

// Setup claim button
function setupClaimButton() {
    const claimBtn = document.getElementById('claimBtn')
    if (claimBtn) {
        claimBtn.addEventListener('click', async () => {
            const account = getAccount(wagmiConfig)
            if (!account.address) {
                alert('Please connect your wallet first!')
                return
            }
            
            try {
                claimBtn.disabled = true
                claimBtn.textContent = '⏳ Processing...'
                
                // Write to contract - claim rewards
                const hash = await writeContract(wagmiConfig, {
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'claimRewards',
                    args: []
                })
                
                claimBtn.textContent = '⏳ Confirming...'
                
                // Wait for transaction receipt
                const receipt = await waitForTransactionReceipt(wagmiConfig, { hash })
                
                console.log('✅ Transaction confirmed:', receipt.transactionHash)
                
                alert('✅ Rewards claimed successfully!')
                
                // Refresh dashboard after delay
                setTimeout(() => updateDashboard(account.address), 2000)
                
                claimBtn.textContent = '💰 Claim Mining Earnings'
                claimBtn.disabled = false
            } catch (error) {
                console.error('Error claiming:', error)
                
                // Check if user rejected
                if (error.shortMessage?.includes('User rejected') || error.shortMessage?.includes('rejected')) {
                    alert('❌ Transaction rejected')
                } else {
                    alert('❌ Failed to claim rewards: ' + (error.shortMessage || error.message))
                }
                
                claimBtn.textContent = '💰 Claim Mining Earnings'
                claimBtn.disabled = false
            }
        })
    }
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm')
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault()
            
            const formData = new FormData(contactForm)
            const name = contactForm.querySelector('input[type="text"]').value
            const email = contactForm.querySelector('input[type="email"]').value
            const message = contactForm.querySelector('textarea').value
            
            console.log('Contact form submitted:', { name, email, message })
            
            // For now, just show success message
            alert('✅ Thank you for your message! We will get back to you soon.\n\nNote: Form submission requires backend integration.')
            
            // Clear form
            contactForm.reset()
        })
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute('href'))
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        })
    })
}

// Animate elements on scroll
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1'
                entry.target.style.transform = 'translateY(0)'
            }
        })
    }, observerOptions)

    // Observe all feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0'
        card.style.transform = 'translateY(20px)'
        card.style.transition = 'all 0.6s ease'
        observer.observe(card)
    })
}

// Referral System Functions
function setupReferralSystem() {
    // Check for referral in URL
    const urlParams = new URLSearchParams(window.location.search)
    const refAddress = urlParams.get('ref')
    
    if (refAddress) {
        // Store referral in localStorage
        if (!localStorage.getItem('referralAddress')) {
            localStorage.setItem('referralAddress', refAddress)
            console.log('✅ Referral code saved:', refAddress)
        }
    }
    
    // Update referral display if wallet connected
    if (currentAddress) {
        updateReferralDisplay()
    }
}

// Detect if user is in MetaMask's in-app browser
function isMetaMaskBrowser() {
    // Check for MetaMask's user agent
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const isMetaMask = /MetaMask/i.test(userAgent)
    
    // Check if ethereum provider is MetaMask
    if (typeof window.ethereum !== 'undefined') {
        const isMetaMaskProvider = window.ethereum.isMetaMask === true
        return isMetaMask || isMetaMaskProvider
    }
    
    return isMetaMask
}

// Auto-add token in MetaMask browser (one-click)
async function autoAddToMetaMaskBrowser() {
    if (!isMetaMaskBrowser()) {
        return false // Not in MetaMask browser
    }
    
    if (typeof window.ethereum === 'undefined') {
        return false // MetaMask not available
    }
    
    try {
        const contractAddress = CONTRACT_ADDRESS
        const tokenSymbol = 'CleanSpark'
        const tokenDecimals = 18
        const tokenImage = 'https://via.placeholder.com/200?text=CleanSpark' // You can replace with your token logo URL
        
        // Request to add token
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: contractAddress,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals,
                    image: tokenImage,
                },
            },
        })
        
        if (wasAdded) {
            console.log('✅ Token added to MetaMask successfully!')
            return true
        }
        return false
    } catch (error) {
        console.error('Error auto-adding token:', error)
        return false
    }
}

// Get referral from URL or localStorage
function getReferrerAddress() {
    const urlParams = new URLSearchParams(window.location.search)
    const urlRef = urlParams.get('ref')
    
    if (urlRef) {
        return urlRef
    }
    
    return localStorage.getItem('referralAddress') || null
}

// Update referral display
async function updateReferralDisplay() {
    if (!currentAddress) return
    
    try {
        const referralInfo = await readContract(wagmiConfig, {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getReferralInfo',
            args: [currentAddress]
        })
        
        // Update referral stats if element exists
        const referralStats = document.getElementById('referralStats')
        if (referralStats) {
            referralStats.innerHTML = `
                <div class="referral-stat">
                    <strong>Referrals:</strong> ${referralInfo.count.toString()}
                </div>
                <div class="referral-stat">
                    <strong>Total Earnings:</strong> ${formatUSDT(referralInfo.totalEarnings)} USDT
                </div>
                <div class="referral-stat">
                    <strong>Total Volume:</strong> ${formatUSDT(referralInfo.totalVolume)} USDT
                </div>
            `
        }
        
        // Show referral link if user has referrals
        if (Number(referralInfo.count) > 0) {
            showReferralLink()
        }
    } catch (error) {
        console.error('Error fetching referral info:', error)
    }
}

// Show referral link
function showReferralLink() {
    if (!currentAddress) return
    
    const referralSection = document.getElementById('myReferralLink')
    if (referralSection) {
        const referralLink = `${window.location.origin}${window.location.pathname}?ref=${currentAddress}`
        referralSection.innerHTML = `
            <div class="referral-link-box">
                <h3>🎁 Your Referral Link</h3>
                <p>Share this link to earn 5% commission on every purchase!</p>
                <div class="referral-link-input">
                    <input type="text" id="referralLinkInput" value="${referralLink}" readonly>
                    <button onclick="copyReferralLink()" class="btn btn-primary">Copy</button>
                </div>
                <p class="referral-note">When someone buys using your link, you get 5% commission automatically!</p>
            </div>
        `
        referralSection.style.display = 'block'
    }
}

// Copy referral link
function copyReferralLink() {
    const input = document.getElementById('referralLinkInput')
    if (input) {
        input.select()
        document.execCommand('copy')
        alert('✅ Referral link copied!')
    }
}

// Format USDT (18 decimals)
function formatUSDT(amount) {
    const divisor = BigInt(10 ** 18)
    const whole = amount / divisor
    const decimal = amount % divisor
    const decimals_str = decimal.toString().padStart(18, '0').replace(/0+$/, '') || '0'
    return decimals_str === '0' ? whole.toString() : `${whole}.${decimals_str.substring(0, 2)}`
}

// Buy Functions
function setupBuyFunctions() {
    // Make buy function globally available
    window.buyTokens = async function(usdtAmount, paymentMethod = 'USDT') {
        const account = getAccount(wagmiConfig)
        if (!account.address) {
            alert('Please connect your wallet first!')
            modal.open()
            return
        }
        
        try {
            // Convert USDT amount to wei (18 decimals)
            const amountInWei = BigInt(Math.floor(usdtAmount * 1e18))
            
            // Get referrer if available
            const referrer = getReferrerAddress()
            
            if (paymentMethod === 'BNB') {
                // Buy with BNB
                // Get BNB to USDT rate from contract
                const bnbToUsdtRate = await readContract(wagmiConfig, {
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'bnbToUsdtRate'
                })
                
                // Calculate BNB amount: bnbAmount = (usdtAmount * 1e18) / bnbToUsdtRate
                const bnbAmount = (amountInWei * BigInt(1e18)) / bnbToUsdtRate
                
                // Check BNB balance
                const bnbBalance = await getBalance(wagmiConfig, { address: account.address })
                if (bnbBalance.value < bnbAmount) {
                    const bnbRequired = Number(bnbAmount) / 1e18
                    const bnbHave = Number(bnbBalance.value) / 1e18
                    alert(`❌ Insufficient BNB balance!\n\nYou have: ${bnbHave.toFixed(4)} BNB\nRequired: ${bnbRequired.toFixed(4)} BNB`)
                    return
                }
                
                // Buy with BNB
                if (referrer) {
                    alert('⏳ Purchasing tokens with BNB... Please confirm in your wallet.')
                    const hash = await writeContract(wagmiConfig, {
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: 'buyTokensWithBNBAndReferral',
                        args: [referrer],
                        value: bnbAmount
                    })
                    
                    alert('⏳ Transaction submitted! Waiting for confirmation...')
                    const receipt = await waitForTransactionReceipt(wagmiConfig, { hash })
                    alert('✅ Tokens purchased successfully!')
                    
                    localStorage.removeItem('referralAddress')
                    setTimeout(() => updateDashboard(account.address), 2000)
                } else {
                    alert('⏳ Purchasing tokens with BNB... Please confirm in your wallet.')
                    const hash = await writeContract(wagmiConfig, {
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: 'buyTokensWithBNB',
                        args: [],
                        value: bnbAmount
                    })
                    
                    alert('⏳ Transaction submitted! Waiting for confirmation...')
                    const receipt = await waitForTransactionReceipt(wagmiConfig, { hash })
                    alert('✅ Tokens purchased successfully!')
                    
                    setTimeout(() => updateDashboard(account.address), 2000)
                }
            } else {
                // Buy with USDT
                // Step 1: Check USDT balance
                const usdtBalance = await readContract(wagmiConfig, {
                    address: USDT_ADDRESS,
                    abi: USDT_ABI,
                    functionName: 'balanceOf',
                    args: [account.address]
                })
                
                if (usdtBalance < amountInWei) {
                    alert(`❌ Insufficient USDT balance!\n\nYou have: ${formatUSDT(usdtBalance)} USDT\nRequired: ${usdtAmount} USDT`)
                    return
                }
                
                // Step 2: Check and approve USDT allowance
                const currentAllowance = await readContract(wagmiConfig, {
                    address: USDT_ADDRESS,
                    abi: USDT_ABI,
                    functionName: 'allowance',
                    args: [account.address, CONTRACT_ADDRESS]
                })
                
                if (currentAllowance < amountInWei) {
                    alert('⏳ Approving USDT... Please confirm in your wallet.')
                    
                    // Approve USDT (approve more than needed for future purchases)
                    const approveAmount = amountInWei * BigInt(100) // Approve 100x for future purchases
                    const approveHash = await writeContract(wagmiConfig, {
                        address: USDT_ADDRESS,
                        abi: USDT_ABI,
                        functionName: 'approve',
                        args: [CONTRACT_ADDRESS, approveAmount]
                    })
                    
                    await waitForTransactionReceipt(wagmiConfig, { hash: approveHash })
                    alert('✅ USDT approved! Proceeding with purchase...')
                }
                
                // Step 3: Buy tokens
                if (referrer) {
                    // Buy with referral
                    alert('⏳ Purchasing tokens with USDT... Please confirm in your wallet.')
                    const hash = await writeContract(wagmiConfig, {
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: 'buyTokensWithReferral',
                        args: [amountInWei, referrer]
                    })
                    
                    alert('⏳ Transaction submitted! Waiting for confirmation...')
                    const receipt = await waitForTransactionReceipt(wagmiConfig, { hash })
                    alert('✅ Tokens purchased successfully!')
                    
                    localStorage.removeItem('referralAddress')
                    setTimeout(() => updateDashboard(account.address), 2000)
                } else {
                    // Buy without referral
                    alert('⏳ Purchasing tokens with USDT... Please confirm in your wallet.')
                    const hash = await writeContract(wagmiConfig, {
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: 'buyTokens',
                        args: [amountInWei]
                    })
                    
                    alert('⏳ Transaction submitted! Waiting for confirmation...')
                    const receipt = await waitForTransactionReceipt(wagmiConfig, { hash })
                    alert('✅ Tokens purchased successfully!')
                    
                    setTimeout(() => updateDashboard(account.address), 2000)
                }
            }
        } catch (error) {
            console.error('Error buying tokens:', error)
            
            if (error.shortMessage?.includes('User rejected') || error.shortMessage?.includes('rejected')) {
                alert('❌ Transaction rejected')
            } else {
                alert('❌ Failed to buy tokens: ' + (error.shortMessage || error.message))
            }
        }
    }
    
    // Make get referral link globally available
    window.getMyReferralLink = function() {
        if (!currentAddress) {
            alert('Please connect your wallet first!')
            return
        }
        return `${window.location.origin}${window.location.pathname}?ref=${currentAddress}`
    }
    
    // Make copy referral link globally available
    window.copyReferralLink = copyReferralLink
}

// Update payment method
window.updatePaymentMethod = async function() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'USDT'
    const amountInput = document.getElementById('buyAmount')
    const bnbEquivalent = document.getElementById('bnbEquivalent')
    const bnbAmount = document.getElementById('bnbAmount')
    const paymentMethodUSDT = document.getElementById('paymentMethodUSDT')
    const paymentMethodBNB = document.getElementById('paymentMethodBNB')
    
    if (paymentMethod === 'BNB') {
        amountInput.placeholder = 'Enter amount in USDT'
        if (paymentMethodBNB) paymentMethodBNB.style.borderColor = '#3b82f6'
        if (paymentMethodUSDT) paymentMethodUSDT.style.borderColor = '#e5e7eb'
    } else {
        amountInput.placeholder = 'Enter amount in USDT'
        if (paymentMethodUSDT) paymentMethodUSDT.style.borderColor = '#3b82f6'
        if (paymentMethodBNB) paymentMethodBNB.style.borderColor = '#e5e7eb'
    }
    
    // Recalculate to update BNB equivalent
    calculateTokens()
}

// Calculate tokens from USDT amount
window.calculateTokens = async function() {
    const amountInput = document.getElementById('buyAmount')
    const tokensPreview = document.getElementById('tokensPreview')
    const tokensAmount = document.getElementById('tokensAmount')
    const bnbEquivalent = document.getElementById('bnbEquivalent')
    const bnbAmount = document.getElementById('bnbAmount')
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'USDT'
    
    if (!amountInput || !tokensPreview || !tokensAmount) return
    
    const usdtAmount = parseFloat(amountInput.value)
    
    if (usdtAmount && usdtAmount > 0) {
        // Fixed price: 1 USDT = 1 token
        const tokens = usdtAmount
        tokensAmount.textContent = formatNumber(tokens) + ' CleanSpark'
        tokensPreview.style.display = 'block'
        
        // Calculate BNB equivalent if BNB is selected
        if (paymentMethod === 'BNB' && bnbEquivalent && bnbAmount) {
            try {
                const bnbToUsdtRate = await readContract(wagmiConfig, {
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'bnbToUsdtRate'
                })
                
                // bnbAmount = (usdtAmount * 1e18) / bnbToUsdtRate
                const bnbRequired = (usdtAmount * 1e18) / Number(bnbToUsdtRate)
                bnbAmount.textContent = bnbRequired.toFixed(6)
                bnbEquivalent.style.display = 'block'
            } catch (error) {
                console.error('Error fetching BNB rate:', error)
                bnbEquivalent.style.display = 'none'
            }
        } else {
            if (bnbEquivalent) bnbEquivalent.style.display = 'none'
        }
    } else {
        tokensPreview.style.display = 'none'
        if (bnbEquivalent) bnbEquivalent.style.display = 'none'
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toLocaleString('en-US', { 
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    })
}

// Handle buy tokens
window.handleBuyTokens = async function() {
    const amountInput = document.getElementById('buyAmount')
    const buyButton = document.getElementById('buyButton')
    
    if (!amountInput || !buyButton) return
    
    const usdtAmount = parseFloat(amountInput.value)
    
    if (!usdtAmount || usdtAmount <= 0) {
        alert('❌ Please enter a valid amount')
        return
    }
    
    if (usdtAmount < 0.01) {
        alert('❌ Minimum purchase is 0.01 USDT')
        return
    }
    
    // Show confirmation with important warning
    const confirmMessage = `⚠️ IMPORTANT: Token Not Verified Yet\n\n` +
        `You are about to buy ${formatNumber(usdtAmount)} CleanSpark tokens for ${usdtAmount} USDT.\n\n` +
        `⚠️ This token is NOT verified in Trust Wallet yet.\n\n` +
        `After purchase:\n` +
        `• Your tokens WILL be in your wallet\n` +
        `• They may NOT appear automatically\n` +
        `• You may need to manually add the token\n` +
        `• Use "Add to Trust Wallet" or "Add to MetaMask" buttons\n\n` +
        `Contract: ${CONTRACT_ADDRESS}\n\n` +
        `Do you want to continue?`
    
    const confirmed = confirm(confirmMessage)
    if (!confirmed) {
        return
    }
    
    // Disable button
    buyButton.disabled = true
    buyButton.textContent = '⏳ Processing...'
    
    try {
        // Get payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'USDT'
        
        // Call the buyTokens function
        await window.buyTokens(usdtAmount, paymentMethod)
        
        // Show success message with instructions
        setTimeout(() => {
            alert(`✅ Purchase Successful!\n\n` +
                `You received ${formatNumber(usdtAmount)} CleanSpark tokens!\n\n` +
                `📱 If tokens don't appear in your wallet:\n` +
                `1. Click "Add to Trust Wallet" or "Add to MetaMask" button\n` +
                `2. Or manually add token with contract address:\n` +
                `   ${CONTRACT_ADDRESS}\n\n` +
                `Your tokens are safe - they're in your wallet, just not displayed yet!`)
        }, 1000)
        
        // Clear input
        amountInput.value = ''
        document.getElementById('tokensPreview').style.display = 'none'
        
        // Reset button
        buyButton.textContent = '₿ Buy Tokens'
        buyButton.disabled = false
    } catch (error) {
        console.error('Error in handleBuyTokens:', error)
        buyButton.textContent = '₿ Buy Tokens'
        buyButton.disabled = false
    }
}

// Copy contract address
window.copyContractAddress = function() {
    const contractAddress = CONTRACT_ADDRESS
    navigator.clipboard.writeText(contractAddress).then(() => {
        alert('✅ Contract address copied to clipboard!')
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = contractAddress
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        alert('✅ Contract address copied to clipboard!')
    })
}

// Add to Trust Wallet
window.addToTrustWallet = function() {
    const contractAddress = CONTRACT_ADDRESS
    const tokenSymbol = 'CleanSpark'
    const tokenDecimals = '18'
    const tokenImage = 'https://via.placeholder.com/200?text=CleanSpark' // You can replace with your token logo URL
    
    // Trust Wallet deep link
    const trustWalletUrl = `https://link.trustwallet.com/add_token?asset=c0x${contractAddress}&name=CleanSpark%20mining%20limited&symbol=${tokenSymbol}&decimals=${tokenDecimals}`
    
    // Try to open Trust Wallet
    window.open(trustWalletUrl, '_blank')
    
    // Show instructions
    setTimeout(() => {
        alert(`📱 Adding to Trust Wallet:\n\n1. If Trust Wallet opens, approve the request\n2. If not, manually add token:\n   - Open Trust Wallet\n   - Go to Settings > Security > Add Custom Token\n   - Network: Smart Chain (BSC)\n   - Contract: ${contractAddress}\n   - Symbol: ${tokenSymbol}\n   - Decimals: ${tokenDecimals}\n\nContract address copied to clipboard!`)
    }, 500)
    
    // Copy address to clipboard
    copyContractAddress()
}

// Add to MetaMask
window.addToMetaMask = async function() {
    const contractAddress = CONTRACT_ADDRESS
    const tokenSymbol = 'CleanSpark'
    const tokenDecimals = 18
    const tokenImage = 'https://via.placeholder.com/200?text=CleanSpark' // You can replace with your token logo URL
    
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            alert('❌ MetaMask is not installed. Please install MetaMask first.')
            return
        }
        
        // Request to add token
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: contractAddress,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals,
                    image: tokenImage,
                },
            },
        })
        
        if (wasAdded) {
            alert('✅ Token added to MetaMask successfully!')
        } else {
            alert('⚠️ Token addition was cancelled.')
        }
    } catch (error) {
        console.error('Error adding token to MetaMask:', error)
        
        // Fallback: Show manual instructions
        alert(`🦊 Manual Add to MetaMask:\n\n1. Open MetaMask\n2. Click "Import tokens"\n3. Paste contract address:\n   ${contractAddress}\n4. Token symbol: ${tokenSymbol}\n5. Decimals: ${tokenDecimals}\n\nContract address copied to clipboard!`)
        
        // Copy address to clipboard
        copyContractAddress()
    }
}

// Setup MetaMask browser features
function setupMetaMaskBrowserFeatures() {
    // Check if in MetaMask browser
    const isInMetaMask = isMetaMaskBrowser()
    
    if (isInMetaMask) {
        console.log('✅ Detected MetaMask in-app browser')
        
        // Show special MetaMask browser message
        const metaMaskBrowserNotice = document.getElementById('metaMaskBrowserNotice')
        if (metaMaskBrowserNotice) {
            metaMaskBrowserNotice.style.display = 'block'
        }
        
        // Auto-add token button (one-click)
        const autoAddButton = document.getElementById('autoAddToMetaMask')
        if (autoAddButton) {
            autoAddButton.style.display = 'block'
            autoAddButton.onclick = async () => {
                autoAddButton.disabled = true
                autoAddButton.textContent = '⏳ Adding...'
                
                const success = await autoAddToMetaMaskBrowser()
                
                if (success) {
                    autoAddButton.textContent = '✅ Added!'
                    autoAddButton.style.background = '#059669'
                    setTimeout(() => {
                        autoAddButton.style.display = 'none'
                    }, 3000)
                } else {
                    autoAddButton.textContent = '❌ Failed - Try Manual Add'
                    autoAddButton.style.background = '#dc2626'
                    setTimeout(() => {
                        autoAddButton.textContent = '📱 One-Click Add to MetaMask'
                        autoAddButton.style.background = '#1f2937'
                        autoAddButton.disabled = false
                    }, 3000)
                }
            }
        }
    } else {
        // Hide MetaMask browser specific features
        const metaMaskBrowserNotice = document.getElementById('metaMaskBrowserNotice')
        if (metaMaskBrowserNotice) {
            metaMaskBrowserNotice.style.display = 'none'
        }
        
        const autoAddButton = document.getElementById('autoAddToMetaMask')
        if (autoAddButton) {
            autoAddButton.style.display = 'none'
        }
    }
}

// Export functions for global use
window.updateDashboard = updateDashboard
window.openWalletModal = () => {
    try {
        if (modal && typeof modal.open === 'function') {
            modal.open()
        } else {
            console.error('Modal not initialized')
            // Fallback: try to use window.openConnectModal if available
            if (window.openConnectModal) {
                window.openConnectModal()
            } else {
                alert('Wallet connection not ready. Please refresh the page.')
            }
        }
    } catch (error) {
        console.error('Error opening wallet modal:', error)
        alert('Error connecting wallet. Please refresh the page.')
    }
}
window.handleDisconnect = handleDisconnect
window.disconnectWallet = handleDisconnect
window.updateReferralDisplay = updateReferralDisplay
window.showReferralLink = showReferralLink
window.autoAddToMetaMaskBrowser = autoAddToMetaMaskBrowser
window.isMetaMaskBrowser = isMetaMaskBrowser

console.log('✅ CleanSpark App initialized')
