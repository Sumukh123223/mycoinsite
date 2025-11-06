# BNB & USDT Payment Support - Update Summary

## ✅ CONTRACT UPDATED TO SUPPORT BOTH BNB AND USDT!

### Changes Made:

1. **Added BNB to USDT Conversion Rate**
   - State variable: `bnbToUsdtRate` (default: 600 USDT per BNB)
   - Owner can update rate using `setBnbToUsdtRate()`

2. **Added BNB Payment Functions**
   - `buyTokensWithBNB()` - Buy tokens with BNB (payable)
   - `buyTokensWithBNBAndReferral(address referrer)` - Buy with BNB and referral

3. **Updated Sell Function**
   - Now handles both USDT and BNB
   - Tries USDT first, falls back to BNB if USDT insufficient

4. **Website Updates**
   - Added payment method selector (USDT/BNB)
   - Shows BNB equivalent when BNB is selected
   - Handles both payment methods in buy flow

---

## 📝 HOW IT WORKS:

### Buying with USDT:
1. User selects "USDT" payment method
2. User enters USDT amount
3. Website checks USDT balance
4. Website approves USDT (if needed)
5. Contract transfers USDT from user
6. User receives tokens

### Buying with BNB:
1. User selects "BNB" payment method
2. User enters USDT amount (for token calculation)
3. Website calculates BNB equivalent using `bnbToUsdtRate`
4. Website checks BNB balance
5. Contract receives BNB (payable function)
6. Contract converts BNB to USDT equivalent
7. User receives tokens

---

## 🔄 BNB TO USDT CONVERSION:

### Formula:
```
usdtAmount = (bnbAmount * bnbToUsdtRate) / 1e18
tokens = usdtAmount (1 USDT = 1 token)
```

### Example:
- User sends: 1 BNB
- Rate: 600 USDT per BNB
- USDT equivalent: 600 USDT
- Tokens received: 600 tokens

---

## ⚙️ OWNER FUNCTIONS:

### Update BNB to USDT Rate:
```solidity
function setBnbToUsdtRate(uint256 newRate) public onlyOwner
```

**Example:**
- Current rate: 600 USDT per BNB
- To update to 650 USDT per BNB:
  - Call `setBnbToUsdtRate(650 * 1e18)`

**Limits:**
- Minimum: > 0
- Maximum: 10000 USDT per BNB

---

## 💡 SELL FUNCTION:

The `sellTokens()` function now:
1. Calculates USDT amount to pay
2. Tries to send USDT first
3. If USDT insufficient, converts to BNB and sends BNB
4. Conversion: `bnbAmount = (usdtAmount * 1e18) / bnbToUsdtRate`

---

## 📊 WEBSITE FEATURES:

### Payment Method Selector:
- Radio buttons: USDT / BNB
- Visual feedback when selected
- Updates input placeholder

### BNB Equivalent Display:
- Shows required BNB amount when BNB is selected
- Updates in real-time as user types
- Fetches rate from contract

### Buy Flow:
- Handles USDT approval (if needed)
- Handles BNB balance check
- Shows appropriate messages for each method

---

## ⚠️ IMPORTANT NOTES:

### BNB Rate:
- Default: 600 USDT per BNB
- Owner should update regularly to match market price
- Can be updated anytime using `setBnbToUsdtRate()`

### Gas Fees:
- BNB purchases: Gas paid from BNB sent (included in amount)
- USDT purchases: Gas paid separately in BNB

### Pool Balance:
- `poolUSDT` tracks USDT equivalent value
- Includes both USDT and BNB (converted to USDT value)
- Used for sell function calculations

---

## 🎯 SUMMARY:

✅ **Users can buy with:**
- USDT (direct transfer)
- BNB (converted to USDT equivalent)

✅ **Users can sell and receive:**
- USDT (preferred)
- BNB (if USDT insufficient)

✅ **Owner can:**
- Update BNB to USDT rate
- Add liquidity in USDT
- Monitor pool balance

---

## 🚀 READY TO USE!

The contract and website now support both BNB and USDT payments. Users can choose their preferred payment method!

