# USDT & BNB Liquidity Management Guide

## ✅ Both USDT and BNB Support!

You can now add both USDT and BNB to the liquidity pool using direct transfers.

---

## 📋 Available Functions

### Adding Liquidity:

#### 1. `addLiquidityFromContract()` - Add All (USDT + BNB)
- Adds ALL USDT and BNB currently in contract to pool
- Converts BNB to USDT equivalent using `bnbToUsdtRate`
- No parameters needed
- Owner only

#### 2. `addLiquidityAmount(uint256 usdtAmount)` - Add Specific USDT
- Adds specific amount of USDT from contract to pool
- Requires contract has at least that amount
- Owner only

#### 3. `addLiquidityBNBFromContract()` - Add All BNB
- Adds ALL BNB currently in contract to pool
- Converts BNB to USDT equivalent
- No parameters needed
- Owner only

#### 4. `addLiquidityBoth()` - Add Both (USDT + BNB)
- Adds ALL USDT and BNB from contract to pool
- Same as `addLiquidityFromContract()`
- Owner only

### Withdrawing Liquidity:

#### 5. `withdrawUSDT(uint256 amount)` - Withdraw USDT
- Withdraws specific amount of USDT from pool
- Transfers USDT to owner
- Owner only

#### 6. `withdrawAllUSDT()` - Withdraw All USDT
- Withdraws all USDT from pool
- Transfers all USDT to owner
- Owner only

#### 7. `withdrawBNB(uint256 bnbAmount)` - Withdraw BNB
- Withdraws specific amount of BNB from contract
- Updates pool (subtracts USDT equivalent)
- Transfers BNB to owner
- Owner only

#### 8. `withdrawAllBNB()` - Withdraw All BNB
- Withdraws all BNB from contract
- Updates pool (subtracts USDT equivalent)
- Transfers all BNB to owner
- Owner only

---

## 📋 How to Add USDT

### Step 1: Send USDT to Contract

**Using BscScan:**
1. Go to USDT contract: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955
2. Click "Write Contract"
3. Find `transfer` function
4. Enter:
   - `to`: Your contract address
   - `amount`: Amount in Wei (e.g., 10 USDT = 10000000000000000000)
5. Click "Write" and confirm

**Using MetaMask:**
1. Send USDT directly to your contract address
2. Use your wallet's send function

### Step 2: Add to Pool

**Option A: Add All USDT**
1. Go to your contract on BscScan
2. Click "Write Contract"
3. Find `addLiquidityFromContract` function
4. Click "Write" (no parameters)
5. Confirm

**Option B: Add Specific Amount**
1. Find `addLiquidityAmount` function
2. Enter amount: `10000000000000000000` (10 USDT)
3. Click "Write" and confirm

---

## 📋 How to Add BNB

### Step 1: Send BNB to Contract

**Using BscScan:**
1. Go to your contract: https://bscscan.com/address/YOUR_CONTRACT_ADDRESS
2. Click "Write Contract"
3. Find any function (or just send BNB directly)
4. Send BNB to contract address using your wallet

**Using MetaMask:**
1. Send BNB directly to your contract address
2. Contract has `receive()` function to accept BNB

### Step 2: Add to Pool

**Option A: Add All BNB**
1. Go to your contract on BscScan
2. Click "Write Contract"
3. Find `addLiquidityBNBFromContract` function
4. Click "Write" (no parameters)
5. Confirm

**Option B: Add Both USDT and BNB**
1. Find `addLiquidityBoth` or `addLiquidityFromContract` function
2. Click "Write" (no parameters)
3. Confirms - adds both if present

---

## 📋 How to Add Both USDT and BNB

### Step 1: Send Both to Contract

1. Send USDT to contract (using USDT contract's transfer function)
2. Send BNB to contract (direct transfer)

### Step 2: Add Both to Pool

1. Go to your contract on BscScan
2. Click "Write Contract"
3. Find `addLiquidityFromContract` or `addLiquidityBoth` function
4. Click "Write" (no parameters)
5. Confirms - adds both automatically!

---

## 📋 How to Withdraw

### Withdraw USDT:
1. Go to contract on BscScan
2. Click "Write Contract"
3. Find `withdrawUSDT` function
4. Enter amount in Wei
5. Click "Write" and confirm

### Withdraw BNB:
1. Go to contract on BscScan
2. Click "Write Contract"
3. Find `withdrawBNB` function
4. Enter BNB amount in Wei
5. Click "Write" and confirm

### Withdraw All:
- Use `withdrawAllUSDT()` or `withdrawAllBNB()`

---

## 💡 Important Notes

1. **BNB Conversion Rate:**
   - BNB is converted to USDT equivalent using `bnbToUsdtRate`
   - Default: 1 BNB = 600 USDT (adjustable by owner)
   - Rate can be updated using `setBnbToUsdtRate()`

2. **Pool Tracking:**
   - Pool tracks everything in USDT equivalent
   - BNB is converted to USDT value when added
   - Pool represents total USDT value available

3. **Selling Tokens:**
   - Users can sell tokens and receive USDT or BNB
   - Contract automatically uses USDT first, then BNB if needed
   - This is handled in `sellTokens()` function

4. **Contract Receives BNB:**
   - Contract has `receive()` function
   - Can receive BNB directly via direct transfer
   - No special function call needed

---

## ✅ Advantages

- ✓ No approval needed for direct transfers
- ✓ Works with both USDT and BNB
- ✓ Flexible - add all or specific amounts
- ✓ Easy to use - just transfer and call function
- ✓ Safe - owner can withdraw when needed

---

## 📝 Example Workflow

1. **Owner has 100 USDT and 0.1 BNB**
2. **Send 10 USDT to contract:**
   - Go to USDT contract
   - Use `transfer` function
   - Send to contract address
3. **Send 0.1 BNB to contract:**
   - Direct transfer from wallet
4. **Add both to pool:**
   - Call `addLiquidityFromContract()` on your contract
   - Pool increases by: 10 USDT + (0.1 BNB × 600) = 10 + 60 = 70 USDT equivalent
5. **Users can now buy/sell tokens**
6. **Later, withdraw if needed:**
   - Call `withdrawUSDT(amount)` or `withdrawBNB(amount)`

---

This approach is simple, flexible, and works with both USDT and BNB!

