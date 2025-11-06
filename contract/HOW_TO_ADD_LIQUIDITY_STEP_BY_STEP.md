# How to Add Liquidity - Step by Step Guide

## 📋 ADD LIQUIDITY TO CONTRACT

### Prerequisites (Must Complete First!)

- [x] USDT approved to contract (see HOW_TO_APPROVE_USDT.md)
- [x] USDT balance >= amount you want to add
- [x] BNB balance >= 0.02 BNB (for gas fees)
- [x] Connected to BSC network

---

## 🚀 STEP-BY-STEP: ADD LIQUIDITY

### Step 1: Go to Your Contract on BscScan

1. **Open BscScan:**
   - Go to: https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8

2. **Click "Write Contract" Tab:**
   - Scroll down to find the "Write Contract" section
   - You'll see a list of functions

---

### Step 2: Connect Your Wallet

1. **Click "Connect to Web3":**
   - A popup will appear
   - Select your wallet (MetaMask, WalletConnect, etc.)
   - Approve the connection

2. **Verify Connection:**
   - Your wallet address should appear at the top
   - Make sure it's your **owner wallet** (the one with USDT)

---

### Step 3: Find `addLiquidity` Function

1. **Scroll down to find `addLiquidity` function:**
   - It should have 1 input field:
     - `usdtAmount (uint256)`

2. **Function Details:**
   - Function #: Usually around function #15-20
   - Input: `usdtAmount` (uint256)
   - Access: Owner only

---

### Step 4: Calculate Amount in Wei

**Wei Conversion:**
- 1 USDT = 1,000,000,000,000,000,000 Wei (10^18)

**Examples:**
- 1 USDT = `1000000000000000000`
- 10 USDT = `10000000000000000000`
- 100 USDT = `100000000000000000000`
- 1000 USDT = `1000000000000000000000`
- 5000 USDT = `5000000000000000000000`
- 10000 USDT = `10000000000000000000000`

**Quick Calculation:**
- Amount in USDT × 1,000,000,000,000,000,000 = Amount in Wei
- Example: 1000 USDT × 1e18 = 1000000000000000000000 Wei

---

### Step 5: Enter Amount and Submit

1. **Enter Amount in Wei:**
   - In the `usdtAmount` field, enter the amount in Wei
   - Example: For 1000 USDT, enter `1000000000000000000000`

2. **Click "Write" Button:**
   - A wallet popup will appear
   - Review the transaction details:
     - Function: `addLiquidity(uint256)`
     - Amount: Your USDT amount
   - Confirm the transaction
   - Wait for confirmation (usually 3-5 seconds)

---

### Step 6: Verify Liquidity Added

1. **Go to "Read Contract" Tab:**
   - Click "Read Contract" tab

2. **Check `getPoolBalance` Function:**
   - Find `getPoolBalance` function
   - Click "Query"
   - Should show your added amount (in Wei)

3. **Check `poolUSDT` Variable:**
   - Find `poolUSDT` variable
   - Click "Query"
   - Should show your added amount (in Wei)

4. **Verify on Transaction:**
   - Go to "Transactions" tab
   - Find your `addLiquidity` transaction
   - Click to view details
   - Should show "Success" status

---

## 📊 EXAMPLE: Adding 1000 USDT Liquidity

### Complete Step-by-Step:

1. **Go to Contract:**
   - https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8

2. **Click "Write Contract"**

3. **Connect Wallet:**
   - Click "Connect to Web3"
   - Connect your owner wallet

4. **Find `addLiquidity` Function:**
   - Scroll to function #15-20
   - Find `addLiquidity(uint256 usdtAmount)`

5. **Enter Amount:**
   - `usdtAmount`: `1000000000000000000000`
   - (This is 1000 USDT in Wei)

6. **Click "Write"**

7. **Confirm in Wallet:**
   - Review transaction
   - Confirm
   - Wait for confirmation

8. **Verify:**
   - Go to "Read Contract" tab
   - Check `getPoolBalance()` - should show `1000000000000000000000`
   - Check `poolUSDT` - should show `1000000000000000000000`

---

## ✅ WHAT HAPPENS AFTER ADDING LIQUIDITY

### Immediate Results:

1. **USDT Transferred:**
   - USDT moves from your wallet to contract
   - Contract balance (USDT) increases

2. **Pool Updated:**
   - `poolUSDT` increases by your amount
   - Users can now sell tokens up to this amount

3. **Event Emitted:**
   - `LiquidityAdded` event is emitted
   - You can see it in transaction logs

---

## 🧪 TEST SELL FUNCTION

After adding liquidity, test that users can sell:

1. **Buy Some Tokens First:**
   - Use `buyTokens()` or `buyTokensWithBNB()`
   - Buy a small amount (e.g., 10 tokens)

2. **Test Sell:**
   - Call `sellTokens(10)` (or your amount)
   - Should receive USDT or BNB back
   - Verify transaction succeeds

3. **Check Pool:**
   - `poolUSDT` should decrease by amount sold
   - Your USDT/BNB balance should increase

---

## ⚠️ IMPORTANT NOTES

### Minimum Liquidity:

- **Recommended:** At least $1000 USDT
- **Minimum:** Enough for expected user sell volume
- **Formula:** Minimum liquidity = Expected max sell volume

### Pool Balance:

- **Check Regularly:** Monitor `poolUSDT` balance
- **Add More:** If pool gets low, add more liquidity
- **Keep Reserve:** Always keep some liquidity for users to sell

### Gas Fees:

- **Cost:** Usually 0.001-0.005 BNB per transaction
- **Keep Extra:** Always have extra BNB for multiple transactions

---

## 🔄 ADDING MORE LIQUIDITY LATER

If you need to add more liquidity later:

1. **Approve More USDT** (if needed):
   - If you approved less than you want to add now
   - Go back to USDT contract and approve more

2. **Add Liquidity:**
   - Follow same steps as above
   - Enter new amount in Wei
   - Submit transaction

3. **Pool Increases:**
   - `poolUSDT` will increase by new amount
   - Total pool = Previous + New amount

---

## ⚠️ TROUBLESHOOTING

### Problem: "Insufficient USDT balance"
**Solution:** 
- Check you have enough USDT in wallet
- Make sure USDT is in your connected wallet

### Problem: "Insufficient USDT allowance"
**Solution:**
- Go back and approve USDT to contract
- Make sure approval amount >= liquidity amount
- See HOW_TO_APPROVE_USDT.md

### Problem: "Not owner"
**Solution:**
- Make sure you're using the owner wallet
- Owner is the wallet that deployed the contract

### Problem: "Transaction failed"
**Solution:**
- Check you have enough BNB for gas
- Try increasing gas limit
- Check network is BSC
- Verify USDT approval is sufficient

### Problem: "poolUSDT didn't increase"
**Solution:**
- Wait a few seconds and check again
- Verify transaction was successful
- Check transaction logs for errors

---

## 📋 CHECKLIST

Before adding liquidity:

- [ ] USDT approved to contract
- [ ] Approval amount >= liquidity amount
- [ ] USDT balance >= liquidity amount
- [ ] BNB balance >= 0.02 BNB (for gas)
- [ ] Connected to BSC network
- [ ] Using owner wallet
- [ ] Amount calculated in Wei

After adding liquidity:

- [ ] Transaction confirmed
- [ ] `poolUSDT` increased
- [ ] `getPoolBalance()` shows correct amount
- [ ] Test sell function works

---

## 🎯 READY TO ADD LIQUIDITY!

Follow these steps to add liquidity to your contract. Once added, users will be able to sell their tokens back to the contract!

---

## 📝 QUICK REFERENCE

**Contract Address:** `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`

**Function:** `addLiquidity(uint256 usdtAmount)`

**Common Amounts:**
- 1000 USDT = `1000000000000000000000`
- 5000 USDT = `5000000000000000000000`
- 10000 USDT = `10000000000000000000000`

**BscScan:** https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8

