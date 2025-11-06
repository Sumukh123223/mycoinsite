# How to Add 10 USDT Liquidity - Quick Guide

## 📊 10 USDT IN WEI

### Calculation:

**Formula:**
- 1 USDT = 1,000,000,000,000,000,000 Wei (10^18)
- 10 USDT = 10 × 1,000,000,000,000,000,000 Wei
- **10 USDT = 10,000,000,000,000,000,000 Wei**

### Amount to Use:

**For 10 USDT, enter this in Wei:**
```
10000000000000000000
```

---

## 🚀 STEP-BY-STEP: ADD 10 USDT

### Step 1: Approve USDT (First Time)

1. **Go to USDT Contract:**
   - https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

2. **Click "Write Contract" tab**

3. **Connect Your Wallet:**
   - Click "Connect to Web3"
   - Connect your owner wallet

4. **Find `approve` Function:**
   - Scroll to find `approve` function

5. **Enter Values:**
   - **spender (address):** `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`
   - **amount (uint256):** `10000000000000000000` (10 USDT)

   **OR** Approve more for future (Recommended):
   - **amount (uint256):** `100000000000000000000000` (100,000 USDT)
   - This allows you to add more later without re-approving

6. **Click "Write" and Confirm:**
   - Review transaction
   - Confirm in wallet
   - Wait for confirmation

---

### Step 2: Add 10 USDT Liquidity

1. **Go to Your Contract:**
   - https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8

2. **Click "Write Contract" tab**

3. **Connect Your Wallet:**
   - Click "Connect to Web3"
   - Connect your owner wallet

4. **Find `addLiquidity` Function:**
   - Scroll to find `addLiquidity` function
   - It has 1 input: `usdtAmount (uint256)`

5. **Enter Amount:**
   - **usdtAmount (uint256):** `10000000000000000000`
   - This is 10 USDT in Wei

6. **Click "Write" and Confirm:**
   - Review transaction
   - Confirm in wallet
   - Wait for confirmation (3-5 seconds)

---

### Step 3: Verify Liquidity Added

1. **Go to "Read Contract" tab**

2. **Check `getPoolBalance` Function:**
   - Find `getPoolBalance` function
   - Click "Query"
   - Should show: `10000000000000000000` (10 USDT)

3. **Check `poolUSDT` Variable:**
   - Find `poolUSDT` variable
   - Click "Query"
   - Should show: `10000000000000000000` (10 USDT)

---

## 💡 RECOMMENDED: Approve More for Future

Since you'll add more liquidity later, **approve a larger amount now**:

### Option 1: Approve 100,000 USDT
- **Amount:** `100000000000000000000000`
- Allows you to add up to 100,000 USDT without re-approving
- You can still only add what you have in your wallet

### Option 2: Approve Maximum
- **Amount:** `115792089237316195423570985008687907853269984665640564039457584007913129639935`
- This is the maximum uint256 value
- Allows unlimited approvals (one-time approval)

**Why?**
- Saves gas fees (no need to approve again)
- Faster when adding more liquidity later
- You can still only add what you have in wallet

---

## 🔄 ADDING MORE LATER

After adding 10 USDT, you can add more anytime:

### Example: Add 100 USDT More

1. **Make sure you have:**
   - 100 USDT in wallet
   - Approval amount >= 100 USDT (or approved maximum)

2. **Go to Contract:**
   - https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8

3. **Click "Write Contract"**

4. **Find `addLiquidity` Function**

5. **Enter Amount:**
   - **usdtAmount:** `100000000000000000000` (100 USDT)

6. **Submit Transaction**

7. **Result:**
   - Total pool = 10 USDT + 100 USDT = 110 USDT
   - `poolUSDT` = 110 USDT

---

## 📊 WEI CONVERSION TABLE

| USDT Amount | Wei Amount |
|-------------|------------|
| 1 USDT | `1000000000000000000` |
| 10 USDT | `10000000000000000000` |
| 50 USDT | `50000000000000000000` |
| 100 USDT | `100000000000000000000` |
| 500 USDT | `500000000000000000000` |
| 1000 USDT | `1000000000000000000000` |
| 5000 USDT | `5000000000000000000000` |
| 10000 USDT | `10000000000000000000000` |

---

## ✅ CHECKLIST FOR 10 USDT

Before adding:

- [ ] Have 10 USDT in wallet
- [ ] Have BNB for gas (0.01-0.02 BNB)
- [ ] USDT approved to contract
- [ ] Approval amount >= 10 USDT (or approved maximum)
- [ ] Connected to BSC network
- [ ] Using owner wallet

After adding:

- [ ] Transaction confirmed
- [ ] `poolUSDT` = 10 USDT (`10000000000000000000`)
- [ ] `getPoolBalance()` shows 10 USDT
- [ ] Test sell function works (buy some tokens first, then sell)

---

## 🎯 QUICK SUMMARY

**To add 10 USDT:**

1. **Approve USDT:**
   - Amount: `10000000000000000000` (10 USDT)
   - OR: `100000000000000000000000` (100,000 USDT for future)

2. **Add Liquidity:**
   - Amount: `10000000000000000000` (10 USDT)

3. **Verify:**
   - Check `poolUSDT` = `10000000000000000000`

---

## 🚀 READY TO ADD 10 USDT!

Follow these steps to add 10 USDT liquidity. You can add more later anytime!

