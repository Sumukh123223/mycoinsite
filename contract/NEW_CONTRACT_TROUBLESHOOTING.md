# Troubleshooting - New Contract Transaction Failed

## ❌ Transaction Failed

**Transaction Hash:**
`0x5495e9f97916ab7504183d5b87627fd86f2119393137bad9a52b7b3b0a50985c`

**Contract Address:**
`0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`

---

## 🔍 STEP 1: Check EXACT Error Message

**Most Important - Get the exact error!**

1. **Go to Transaction:**
   - https://bscscan.com/tx/0x5495e9f97916ab7504183d5b87627fd86f2119393137bad9a52b7b3b0a50985c

2. **Scroll Down** and click "Click to see More"

3. **Look for Error Section:**
   - "Error" or "Reason" field
   - Copy the EXACT error message

4. **Common Errors:**
   - `"execution reverted: Insufficient USDT allowance"`
   - `"execution reverted: Insufficient USDT balance"`
   - `"execution reverted: Not owner"`
   - `"execution reverted: Contract is paused"`
   - `"execution reverted: Invalid amount"`
   - `"execution reverted: USDT transfer failed"`

**This will tell us exactly what's wrong!**

---

## 🔍 STEP 2: Verify All Prerequisites

### Check 1: Verify You're the Owner

1. **Go to Contract:**
   - https://bscscan.com/address/0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81

2. **Click "Read Contract" Tab**

3. **Find `owner` Function**

4. **Click "Query"**

5. **Verify:**
   - Owner should be: `0xd256285146ea5d8b6e9e5ecc59bb28d44b52391b`
   - If different: You're not the owner (use owner wallet)

---

### Check 2: Verify Contract is Not Paused

1. **Go to Contract:**
   - https://bscscan.com/address/0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81

2. **Click "Read Contract" Tab**

3. **Find `paused` Function**

4. **Click "Query"**

5. **Verify:**
   - Should be: `false`
   - If `true`: Contract is paused (need to unpause)

---

### Check 3: Verify USDT Balance

1. **Go to USDT Contract:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Read Contract" Tab**

3. **Find `balanceOf` Function**

4. **Enter Your Owner Address:**
   - `0xd256285146ea5d8b6e9e5ecc59bb28d44b52391b`

5. **Click "Query"**

6. **Verify:**
   - Should have at least 10 USDT (or amount you're trying to add)
   - If less: You don't have enough USDT

---

### Check 4: Verify USDT Allowance (MOST IMPORTANT!)

1. **Go to USDT Contract:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Read Contract" Tab**

3. **Find `allowance` Function**

4. **Enter Values:**
   - **owner (address):** `0xd256285146ea5d8b6e9e5ecc59bb28d44b52391b`
   - **spender (address):** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`
     ↑ **NEW CONTRACT ADDRESS!**

5. **Click "Query"**

6. **Check Result:**
   - **If shows 0:** ❌ USDT NOT APPROVED to NEW contract!
   - **If shows amount:** Check if amount >= what you're trying to add

**Important:** Make sure you approved to the NEW contract address, not the old one!

---

## ✅ STEP 3: Re-Approve USDT to NEW Contract

**If allowance is 0 or insufficient, approve again:**

### For NEW Contract Address:

1. **Go to USDT Contract:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Write Contract" Tab**

3. **Connect Owner Wallet:**
   - `0xd256285146ea5d8b6e9e5ecc59bb28d44b52391b`

4. **Find `approve` Function**

5. **Enter Values:**
   - **spender (address):** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`
     ↑ **NEW CONTRACT ADDRESS!** (make sure it's correct!)
   
   - **amount (uint256):** `100000000000000000000000`
     ↑ 100,000 USDT (approve large amount)

6. **Click "Write" and Confirm**

7. **Wait for Confirmation**

8. **Verify Allowance Again:**
   - Go back to "Read Contract" tab
   - Check `allowance` function
   - Should now show: `100000000000000000000000` (or your amount)

---

## 🔍 STEP 4: Check Amount Format

**Make sure you're entering the correct amount format:**

### For 10 USDT:
```
10000000000000000000
```

**NOT:**
- ❌ `10`
- ❌ `10.0`
- ❌ `10000000`

### How to Calculate:
- **1 USDT = 1,000,000,000,000,000,000 Wei** (18 decimals)
- **10 USDT = 10 × 1,000,000,000,000,000,000 = 10,000,000,000,000,000,000 Wei**

---

## 🔍 STEP 5: Check Gas Limit

**Maybe gas limit is too low:**

1. **On BscScan, when clicking "Write":**
   - Before confirming, click "Edit" on gas settings
   - Set gas limit: `200,000`
   - Set gas price: `5 Gwei` (or current network price)

2. **Try transaction again**

---

## 📋 Complete Checklist

Before trying again, verify:

- [ ] **Check exact error message** on BscScan transaction page
- [ ] **Verify you're the owner** (owner = your wallet address)
- [ ] **Verify contract not paused** (paused = false)
- [ ] **Verify USDT balance** (have at least amount you're adding)
- [ ] **Verify USDT allowance** (allowance >= amount you're adding)
- [ ] **Verify allowance is to NEW contract** (`0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`)
- [ ] **Verify amount format** (in Wei, not USDT)
- [ ] **Verify gas limit** (at least 100,000, preferably 200,000)
- [ ] **Verify network** (BSC Mainnet, not testnet)

---

## 🎯 Most Likely Issues

### Issue 1: Approved to Old Contract (90% chance)
**Problem:** You approved USDT to the old contract address, but trying to use new contract.

**Fix:**
- Check allowance with NEW contract address as spender
- If 0, approve to NEW contract address

### Issue 2: Wrong Amount Format (5% chance)
**Problem:** Entered amount as USDT instead of Wei.

**Fix:**
- For 10 USDT, enter: `10000000000000000000`
- Not: `10` or `10.0`

### Issue 3: Not Owner (3% chance)
**Problem:** Using wrong wallet (not owner).

**Fix:**
- Verify owner address on contract
- Use owner wallet for transaction

### Issue 4: Contract Paused (2% chance)
**Problem:** Contract is paused.

**Fix:**
- Check `paused` function
- If true, unpause first

---

## ✅ Quick Fix

**Most likely: You approved to old contract!**

1. **Check allowance with NEW contract:**
   - Go to USDT contract
   - Read Contract → `allowance`
   - owner: `0xd256285146ea5d8b6e9e5ecc59bb28d44b52391b`
   - spender: `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81` ← NEW!
   
2. **If shows 0:**
   - Approve to NEW contract address
   - spender: `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`
   - amount: `100000000000000000000000`

3. **Then try `addLiquidity` again**

---

## 🆘 Still Failing?

1. **Copy EXACT error message** from BscScan
2. **Screenshot** the error section
3. **Check all items** in the checklist above
4. **Share the exact error** so we can diagnose further

---

## 📝 Summary

**Most Common Issue:** Approved USDT to old contract address, but trying to use new contract.

**Fix:** Approve USDT to NEW contract address: `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`

**Then verify:**
- Allowance is > 0 for NEW contract
- You're the owner
- Contract not paused
- Amount format is correct (Wei)
- Gas limit is sufficient

---

**Next Step:** Check the exact error message on BscScan first, then verify allowance is set for the NEW contract address!

