# Pre-Liquidity Checklist - CleanSpark Contract

## 📋 Contract Address
**Final Contract:** `0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8`

---

## ✅ BEFORE ADDING LIQUIDITY - COMPLETE CHECKLIST

### 1. ✅ Verify Contract on BscScan

**Steps:**
1. Go to: https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8
2. Click "Contract" tab
3. Click "Verify and Publish"
4. Fill in the form:
   - **Compiler Version:** 0.8.0+ (or exact version you used)
   - **License:** MIT
   - **Name Tag:** CleanSpark Mining Token
   - **Link:** https://github.com/Sumukh123223/mycoinsite
5. Paste contract code from `DipenMali.sol` (contract name is `CleanSpark`)
6. Submit for verification
7. Wait for verification (usually takes a few minutes)

**Why:** Verification builds trust and allows users to read your contract code.

---

### 2. ✅ Test Basic Functions (SMALL AMOUNTS FIRST!)

**Test with minimal amounts to verify everything works:**

#### Test buyTokens() (USDT):
- Approve USDT to contract first
- Call `buyTokens(0.01 * 1e18)` (0.01 USDT)
- Verify you received tokens
- Check balance increased

#### Test buyTokensWithBNB():
- Send 0.001 BNB (or smallest amount)
- Call `buyTokensWithBNB()` with 0.001 BNB
- Verify you received tokens
- Check balance increased

#### Test sellTokens():
- After buying, test selling a small amount
- Call `sellTokens(smallAmount)`
- Verify you received USDT or BNB back
- Check balance decreased
- Note: Requires liquidity in pool first

#### Test claimRewards():
- Wait 1 day (or test with time manipulation if on testnet)
- Call `claimRewards()`
- Verify rewards were distributed
- Check balance increased

**Why:** Ensures all functions work before adding large liquidity.

---

### 3. ✅ Check Contract State

**Verify these values on BscScan:**

- **Owner Balance:** `balanceOf[owner]` = 10,000,000 tokens (10M)
- **Paused Status:** `paused` = false
- **Pool Balance:** `poolUSDT` = 0 (before adding liquidity)
- **Total Supply:** `totalSupply` = 10,000,000 tokens
- **BNB Rate:** `bnbToUsdtRate` = 600 * 1e18 (600 USDT per BNB)

**How to Check:**
1. Go to contract on BscScan
2. Click "Read Contract"
3. Check each value

**Why:** Ensures contract initialized correctly.

---

### 4. ✅ Prepare for Liquidity

**Decide:**
- How much liquidity to add? (e.g., $1000, $5000, $10000)
- This determines how much users can sell

**Have Ready:**
- USDT for liquidity (e.g., 1000 USDT)
- BNB for gas fees (keep some extra)
- Approve USDT to contract before adding liquidity

**Why:** Need funds ready before calling addLiquidity().

---

### 5. ✅ Add Initial Liquidity

**Steps:**
1. Approve USDT to contract:
   - Go to USDT contract: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955
   - Click "Write Contract"
   - Call `approve(spender: 0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8, amount: 1000 * 1e18)`

2. Add liquidity:
   - Go to contract: https://bscscan.com/address/0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8
   - Click "Write Contract"
   - Connect owner wallet
   - Find `addLiquidity()` function
   - Enter amount (in Wei, e.g., 1000 USDT = 1000000000000000000000)
   - Submit transaction
   - Wait for confirmation
   - Verify `poolUSDT` increased

**Example:**
- To add $1000 liquidity:
- Approve 1000 * 1e18 Wei USDT to contract
- Call `addLiquidity(1000000000000000000000)` (1000 USDT in Wei)

**Why:** Enables users to sell tokens back to the contract.

---

## 🚀 IMPORTANT NOTES

### ⚠️ DO THESE IN ORDER:

1. **First:** Verify contract on BscScan
2. **Second:** Test functions with small amounts
3. **Third:** Check contract state
4. **Fourth:** Add liquidity

### 💡 TIPS:

- Start with small test amounts
- Verify each step before proceeding
- Keep BNB for gas fees
- Document everything

---

## ✅ AFTER ADDING LIQUIDITY

1. Test buy/sell on website
2. Test referral system
3. Monitor pool balance
4. Announce to users

---

## 📝 CONTRACT DETAILS

- **Name:** CleanSpark mining limited
- **Symbol:** CleanSpark
- **Supply:** 10,000,000 tokens
- **Price:** $1 USD per token
- **Rewards:** 1% daily
- **Referral:** 5% commission

---

## 🎯 READY TO GO!

Follow this checklist before adding liquidity to ensure everything works correctly!

