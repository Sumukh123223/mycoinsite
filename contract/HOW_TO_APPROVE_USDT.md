# How to Approve USDT - Step by Step Guide

## 📋 PREPARE FOR LIQUIDITY - COMPLETE GUIDE

### Step 1: Have USDT and BNB Ready

**Requirements:**
- **USDT:** Amount you want to add as liquidity (e.g., 1000 USDT)
- **BNB:** For gas fees (keep at least 0.01-0.02 BNB for multiple transactions)

**Check Your Balance:**
1. Open your wallet (MetaMask, Trust Wallet, etc.)
2. Make sure you have:
   - ✅ USDT balance >= amount you want to add
   - ✅ BNB balance >= 0.02 BNB (for gas)

---

## 🔐 STEP 2: APPROVE USDT TO CONTRACT

### Method 1: Using BscScan (Recommended)

#### Step 2.1: Go to USDT Contract on BscScan

1. **Open BscScan:**
   - Go to: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Write Contract" Tab:**
   - Scroll down to find the "Write Contract" section
   - You'll see a list of functions

#### Step 2.2: Connect Your Wallet

1. **Click "Connect to Web3":**
   - A popup will appear
   - Select your wallet (MetaMask, WalletConnect, etc.)
   - Approve the connection

2. **Verify Connection:**
   - Your wallet address should appear at the top
   - Make sure it's your **owner wallet** (the one with USDT)

#### Step 2.3: Find and Use `approve` Function

1. **Find the `approve` function:**
   - Scroll down to find `approve` function
   - It should have 2 input fields:
     - `spender (address)`
     - `amount (uint256)`

2. **Fill in the fields:**

   **Field 1: `spender (address)`**
   - Enter: `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`
   - This is your CleanSpark contract address

   **Field 2: `amount (uint256)`**
   - Enter: `1000000000000000000000`
   - This is 1000 USDT in Wei (1000 * 10^18)
   - **OR** enter a larger amount like `100000000000000000000000` (100,000 USDT) to avoid re-approving later

3. **Click "Write" Button:**
   - A wallet popup will appear
   - Review the transaction details
   - Confirm the transaction
   - Wait for confirmation (usually 1-3 seconds)

4. **Verify Approval:**
   - Go back to "Read Contract" tab
   - Find `allowance` function
   - Enter:
     - `owner (address)`: Your wallet address
     - `spender (address)`: `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`
   - Click "Query"
   - Should show the amount you approved (or more)

---

### Method 2: Using MetaMask (Alternative)

#### Step 2.1: Add USDT Token to MetaMask (if not already added)

1. **Open MetaMask**
2. **Click "Import tokens"**
3. **Enter USDT Contract Address:**
   - `0x55d398326f99059fF775485246999027B3197955`
4. **Click "Add Custom Token"**

#### Step 2.2: Approve USDT

1. **Go to BscScan USDT Contract:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Write Contract"**
3. **Connect MetaMask**
4. **Find `approve` function**
5. **Enter values and submit**

---

## 💡 IMPORTANT NOTES

### Amount to Approve

**Option 1: Approve Exact Amount**
- If adding 1000 USDT: Approve `1000000000000000000000` (1000 * 10^18)
- You'll need to approve again if you want to add more later

**Option 2: Approve Large Amount (Recommended)**
- Approve `100000000000000000000000` (100,000 USDT)
- This allows you to add liquidity multiple times without re-approving
- You can still only add what you have in your wallet

**Option 3: Approve Maximum**
- Approve `115792089237316195423570985008687907853269984665640564039457584007913129639935`
- This is the maximum uint256 value
- Allows unlimited approvals (one-time approval)

### Wei Conversion

**How to calculate Wei:**
- 1 USDT = 1,000,000,000,000,000,000 Wei (10^18)
- 1000 USDT = 1,000,000,000,000,000,000,000 Wei (1000 * 10^18)

**Quick Reference:**
- 1 USDT = `1000000000000000000` Wei
- 10 USDT = `10000000000000000000` Wei
- 100 USDT = `100000000000000000000` Wei
- 1000 USDT = `1000000000000000000000` Wei
- 10000 USDT = `10000000000000000000000` Wei

---

## ✅ VERIFICATION

### Check Approval Status

1. **Go to BscScan:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Read Contract" tab**

3. **Find `allowance` function**

4. **Enter:**
   - `owner (address)`: Your wallet address
   - `spender (address)`: `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`

5. **Click "Query"**

6. **Result:**
   - Should show the approved amount in Wei
   - If it shows `0`, approval failed or not done yet
   - If it shows your amount, approval successful!

---

## 🚀 NEXT STEPS

After approving USDT:

1. ✅ **USDT Approved** - Contract can now transfer USDT from your wallet
2. ⏭️ **Add Liquidity** - Go to next step: Add liquidity to contract
3. 📊 **Verify Pool** - Check `poolUSDT` increased

---

## 📝 EXAMPLE: Approving 1000 USDT

### Step-by-Step:

1. **Go to:** https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click:** "Write Contract" tab

3. **Click:** "Connect to Web3" → Connect your wallet

4. **Find:** `approve` function

5. **Enter:**
   - `spender`: `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`
   - `amount`: `1000000000000000000000` (1000 USDT)

6. **Click:** "Write" button

7. **Confirm:** In your wallet popup

8. **Wait:** For transaction confirmation

9. **Verify:** Check `allowance` in "Read Contract" tab

---

## ⚠️ TROUBLESHOOTING

### Problem: "Insufficient USDT balance"
**Solution:** Make sure you have enough USDT in your wallet

### Problem: "Transaction failed"
**Solution:** 
- Check you have enough BNB for gas
- Try increasing gas limit
- Check network is BSC (Binance Smart Chain)

### Problem: "Allowance is 0 after approval"
**Solution:**
- Wait a few seconds and check again
- Verify transaction was successful on BscScan
- Try approving again

### Problem: "Can't find approve function"
**Solution:**
- Make sure you're on the USDT contract page
- Scroll down to "Write Contract" section
- Look for function #3 or #4 (approve)

---

## ✅ CHECKLIST

Before adding liquidity, make sure:

- [ ] USDT balance >= amount you want to add
- [ ] BNB balance >= 0.02 BNB (for gas)
- [ ] USDT approved to contract
- [ ] Approval amount >= liquidity amount
- [ ] Connected to BSC network
- [ ] Using owner wallet address

---

## 🎯 READY TO ADD LIQUIDITY!

Once USDT is approved, you can proceed to add liquidity using the `addLiquidity()` function!

