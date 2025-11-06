# Troubleshooting Transaction Revert - addLiquidity

## ❌ Transaction Reverted Error

### Transaction Hash:
`0xb2e0191da0c46d17f3d36dee5e643c6740025c66a3d06661d57852c46c7aea3a`

### Contract Address:
`0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`

---

## 🔍 HOW TO FIND THE EXACT ERROR

### Step 1: Check Transaction on BscScan

1. **Go to Transaction:**
   - https://bscscan.com/tx/0xb2e0191da0c46d17f3d36dee5e643c6740025c66a3d06661d57852c46c7aea3a

2. **Click "Click to see More":**
   - Scroll down to see error details
   - Look for error message

3. **Check Error Message:**
   - Common errors listed below

---

## ❌ COMMON ERRORS AND SOLUTIONS

### Error 1: "Insufficient USDT balance"

**Cause:** You don't have enough USDT in your wallet

**Solution:**
1. Check your USDT balance
2. Make sure you have at least the amount you're trying to add
3. Add more USDT to your wallet if needed

**How to Check:**
- Open your wallet
- Check USDT balance
- Make sure balance >= amount you want to add

---

### Error 2: "Insufficient USDT allowance"

**Cause:** USDT not approved to contract, or approval amount too low

**Solution:**
1. Go to USDT contract: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955
2. Click "Write Contract"
3. Connect wallet
4. Find `approve` function
5. Enter:
   - `spender`: `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`
   - `amount`: Amount >= what you want to add (or maximum)
6. Submit transaction
7. Wait for confirmation
8. Try adding liquidity again

**How to Check Allowance:**
1. Go to USDT contract on BscScan
2. Click "Read Contract"
3. Find `allowance` function
4. Enter:
   - `owner`: Your wallet address
   - `spender`: `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`
5. Click "Query"
6. Should show approved amount (must be >= liquidity amount)

---

### Error 3: "Contract is paused"

**Cause:** Contract is paused by owner

**Solution:**
1. Go to contract on BscScan
2. Click "Read Contract"
3. Find `paused` variable
4. Check if it's `true`
5. If paused, owner needs to call `unpause()` function

**How to Unpause (Owner Only):**
1. Go to contract on BscScan
2. Click "Write Contract"
3. Connect owner wallet
4. Find `unpause` function
5. Click "Write" and confirm

---

### Error 4: "Not owner"

**Cause:** You're not using the owner wallet

**Solution:**
1. Check which wallet deployed the contract
2. Go to contract on BscScan
3. Click "Read Contract"
4. Find `owner` variable
5. Check the owner address
6. Make sure you're using that wallet

**How to Check Owner:**
1. Go to contract: https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8
2. Click "Read Contract"
3. Find `owner` function
4. Click "Query"
5. Shows the owner address

---

### Error 5: "Invalid amount"

**Cause:** Amount is 0 or too large

**Solution:**
1. Make sure amount > 0
2. Check amount is in Wei format
3. For 10 USDT, use: `10000000000000000000`
4. Don't use decimals, use full Wei amount

---

### Error 6: "USDT transfer failed"

**Cause:** USDT transfer from your wallet to contract failed

**Solution:**
1. Check USDT balance
2. Check USDT allowance
3. Make sure you have BNB for gas
4. Try again with sufficient balance and allowance

---

## 🔍 STEP-BY-STEP DIAGNOSIS

### Step 1: Check Transaction Details

1. **Go to Transaction:**
   - https://bscscan.com/tx/0xb2e0191da0c46d17f3d36dee5e643c6740025c66a3d06661d57852c46c7aea3a

2. **Check:**
   - Status: Should show "Fail" or "Reverted"
   - Error message: Click "Click to see More"

### Step 2: Check Your Wallet

1. **USDT Balance:**
   - Open wallet
   - Check USDT balance
   - Should be >= amount you're trying to add

2. **BNB Balance:**
   - Check BNB balance
   - Should have at least 0.01 BNB for gas

### Step 3: Check USDT Approval

1. **Go to USDT Contract:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Check Allowance:**
   - Click "Read Contract"
   - Find `allowance` function
   - Enter your wallet address and contract address
   - Check if allowance >= amount you want to add

### Step 4: Check Contract Status

1. **Go to Contract:**
   - https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8

2. **Check:**
   - `paused` variable - should be `false`
   - `owner` variable - should be your wallet address

---

## ✅ QUICK FIX CHECKLIST

Before trying again, make sure:

- [ ] USDT balance >= amount you want to add
- [ ] USDT approved to contract
- [ ] Approval amount >= liquidity amount
- [ ] BNB balance >= 0.01 BNB (for gas)
- [ ] Contract is not paused
- [ ] Using owner wallet
- [ ] Amount is correct (in Wei, no decimals)
- [ ] Connected to BSC network

---

## 🚀 MOST COMMON FIX

**90% of the time, it's insufficient allowance!**

### Quick Fix:

1. **Approve USDT:**
   - Go to: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955
   - Click "Write Contract"
   - Connect wallet
   - Find `approve` function
   - Enter:
     - `spender`: `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`
     - `amount`: `100000000000000000000000` (100,000 USDT - for future)
   - Submit and wait for confirmation

2. **Try Adding Liquidity Again:**
   - Go to contract
   - Click "Write Contract"
   - Find `addLiquidity` function
   - Enter amount in Wei
   - Submit transaction

---

## 📝 EXAMPLE: Adding 10 USDT

### If Transaction Reverted:

1. **Check Error:**
   - Go to transaction on BscScan
   - See error message

2. **Most Likely: Insufficient Allowance**
   - Approve USDT first:
     - Amount: `10000000000000000000` (10 USDT)
     - OR: `100000000000000000000000` (100,000 USDT for future)

3. **Then Add Liquidity:**
   - Amount: `10000000000000000000` (10 USDT)

---

## 🎯 NEXT STEPS

1. **Check the transaction error** on BscScan
2. **Fix the issue** (usually approval)
3. **Try again** with correct settings

---

## 📞 NEED HELP?

Check the transaction details on BscScan to see the exact error message, then follow the solution above!

