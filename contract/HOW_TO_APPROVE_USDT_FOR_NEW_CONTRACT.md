# How to Approve USDT for New Contract

## ✅ Quick Answer

**Approve the CONTRACT ADDRESS, not your owner address!**

- **Owner Address:** Your wallet address (the one with USDT)
- **Contract Address (Spender):** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81` ← **This is what you approve!**

---

## 📋 Step-by-Step: Approve USDT

### Step 1: Go to USDT Contract on BscScan

1. **Go to USDT Contract:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Write Contract" Tab**

3. **Connect Your Wallet:**
   - Click "Connect to Web3"
   - Connect your **owner wallet** (the one with USDT)
   - Make sure it's your owner wallet address

---

### Step 2: Find `approve` Function

Scroll down to find the `approve` function. It has 2 inputs:
- `spender` (address) - This is the CONTRACT ADDRESS
- `amount` (uint256) - This is the amount to approve

---

### Step 3: Enter Values

**Enter these values:**

1. **spender (address):**
   ```
   0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81
   ```
   ↑ **This is your CONTRACT ADDRESS** (not your owner address!)

2. **amount (uint256):**
   ```
   100000000000000000000000
   ```
   ↑ This is 100,000 USDT (approve large amount for future use)
   
   **Or if you only want to approve for specific amount:**
   - For 10 USDT: `10000000000000000000`
   - For 100 USDT: `100000000000000000000`
   - For 1,000 USDT: `1000000000000000000000`
   - For 10,000 USDT: `10000000000000000000000`

---

### Step 4: Click "Write" and Confirm

1. **Click "Write" Button**
2. **Wallet popup appears**
3. **Review the transaction:**
   - Function: `approve`
   - Spender: `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81` (contract address)
   - Amount: Your approved amount
4. **Confirm transaction**
5. **Wait for confirmation** (1-3 seconds)

---

### Step 5: Verify Approval

1. **Go back to "Read Contract" tab**
2. **Find `allowance` function**
3. **Enter values:**
   - **owner (address):** Your owner wallet address
   - **spender (address):** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`
4. **Click "Query"**
5. **Should show your approved amount**

---

## ✅ Summary

| Item | Value |
|------|-------|
| **Your Wallet (Owner)** | Your wallet address (has USDT) |
| **Contract (Spender)** | `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81` |
| **What to Approve** | **CONTRACT ADDRESS** ✓ |
| **Amount to Approve** | At least what you want to add, or more (e.g., 100,000 USDT) |

---

## 🎯 Example

**If your owner wallet is:** `0xYourOwnerWalletAddress123...`

**What you do:**
1. Go to USDT contract
2. Connect wallet: `0xYourOwnerWalletAddress123...`
3. Call `approve`:
   - **spender:** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81` ← Contract address
   - **amount:** `100000000000000000000000` (100,000 USDT)
4. Confirm transaction

**What this does:**
- Allows the **contract** to spend up to 100,000 USDT from **your wallet**
- You can now call `addLiquidity()` on the contract
- The contract will transfer USDT from your wallet to itself

---

## ⚠️ Important Notes

1. **Approve CONTRACT ADDRESS, not owner address:**
   - ❌ Wrong: Approve your owner address
   - ✅ Correct: Approve contract address `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`

2. **Why approve contract address?**
   - The contract needs permission to transfer USDT FROM your wallet TO itself
   - The contract is the "spender" in the approve function

3. **Approve more than you need:**
   - Approve a large amount (e.g., 100,000 USDT) so you don't need to approve again
   - You can add liquidity multiple times without re-approving

4. **Check allowance before adding liquidity:**
   - Always verify allowance is >= amount you want to add
   - If allowance is 0, you MUST approve first

---

## 🔍 How to Check Current Allowance

1. Go to USDT contract: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955
2. Click "Read Contract" tab
3. Find `allowance` function
4. Enter:
   - **owner:** Your owner wallet address
   - **spender:** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`
5. Click "Query"
6. If shows 0: You need to approve!
7. If shows amount: Check if amount >= what you want to add

---

## 📝 Quick Reference

**USDT Contract:** `0x55d398326f99059fF775485246999027B3197955`
**Your Contract (Spender):** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`
**Function:** `approve(spender, amount)`
**Spender Value:** `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81` ← Contract address!

---

## ✅ After Approval

Once approved, you can:
1. Call `addLiquidity()` on your contract
2. Add any amount up to your approved amount
3. Add liquidity multiple times without re-approving (if you approved large amount)

---

## 🆘 Troubleshooting

**If approval fails:**
- Check you have BNB for gas fees
- Check you're connected with the correct wallet
- Check you're on BSC Mainnet (not testnet)

**If `addLiquidity()` still fails after approval:**
- Check allowance is >= amount you want to add
- Check you have enough USDT in wallet
- Check contract is not paused
- Check you're using owner wallet

---

**Remember: Approve CONTRACT ADDRESS, not owner address!** ✅

