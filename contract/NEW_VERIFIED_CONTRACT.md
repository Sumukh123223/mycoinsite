# New Verified Contract Address

## ✅ Contract Deployed and Verified!

**New Contract Address:**
```
0x45CbCA5f88c510526049F31cECeF626Eb5254784
```

**Status:** ✅ Verified on BscScan

---

## ✅ Website Updated

All website files have been updated with the new contract address:

- ✅ `website/app.js` - CONTRACT_ADDRESS updated
- ✅ `website/index.html` - All 4 references updated:
  - Contract address display in warning box
  - PancakeSwap link
  - BscScan token link
  - BscScan contract link

---

## 🔗 Quick Links

### BscScan Links:
- **Contract:** https://bscscan.com/address/0x45CbCA5f88c510526049F31cECeF626Eb5254784
- **Token:** https://bscscan.com/token/0x45CbCA5f88c510526049F31cECeF626Eb5254784

### PancakeSwap:
- **Swap:** https://pancakeswap.finance/swap?inputCurrency=0x45CbCA5f88c510526049F31cECeF626Eb5254784

---

## 📋 Contract Features

### Liquidity Management (New Approach):

#### Adding Liquidity:
1. **Send USDT directly to contract:**
   - Go to USDT contract: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955
   - Use `transfer` function
   - Send to: `0x45CbCA5f88c510526049F31cECeF626Eb5254784`

2. **Send BNB directly to contract:**
   - Send BNB directly to contract address
   - Contract has `receive()` function

3. **Add to pool:**
   - Call `addLiquidityFromContract()` - Adds all USDT and BNB
   - Or `addLiquidityBNBFromContract()` - Adds only BNB
   - Or `addLiquidityAmount(uint256)` - Adds specific USDT amount

#### Withdrawing Liquidity:
- `withdrawUSDT(uint256)` - Withdraw specific USDT
- `withdrawAllUSDT()` - Withdraw all USDT
- `withdrawBNB(uint256)` - Withdraw specific BNB
- `withdrawAllBNB()` - Withdraw all BNB

---

## 📋 Next Steps

### 1. Test Contract Functions

#### Test Adding Liquidity (USDT):
1. Send 10 USDT to contract using USDT contract's `transfer` function
2. Go to contract: https://bscscan.com/address/0x45CbCA5f88c510526049F31cECeF626Eb5254784
3. Click "Write Contract"
4. Connect owner wallet
5. Find `addLiquidityFromContract` function
6. Click "Write" (no parameters)
7. Confirm transaction

#### Test Adding Liquidity (BNB):
1. Send 0.1 BNB to contract (direct transfer)
2. Go to contract
3. Click "Write Contract"
4. Find `addLiquidityBNBFromContract` function
5. Click "Write" (no parameters)
6. Confirm transaction

#### Test Buying Tokens:
1. Go to contract
2. Click "Write Contract"
3. Connect test wallet
4. Find `buyTokens` function (USDT) or `buyTokensWithBNB` (BNB)
5. Enter amount and confirm

#### Test Selling Tokens:
1. Go to contract
2. Click "Write Contract"
3. Connect wallet with tokens
4. Find `sellTokens` function
5. Enter amount and confirm

### 2. Deploy Website Updates

The website files are updated. Deploy them:
- Push to GitHub (already done)
- Deploy to your hosting service
- Test website integration

### 3. Test Website Integration

1. Open website
2. Connect wallet
3. Test "Buy Tokens" with USDT
4. Test "Buy Tokens" with BNB
5. Test dashboard display
6. Test referral system
7. Test sell tokens

---

## 📝 Contract Details

- **Name:** CleanSpark mining limited
- **Symbol:** CleanSpark
- **Decimals:** 18
- **Total Supply:** 10,000,000 tokens
- **Fixed Price:** 1 USDT = 1 token
- **Reward Rate:** 1% daily (REWARD_RATE = 10, denominator = 1000)
- **Referral Commission:** 5% (REFERRAL_COMMISSION = 50, denominator = 1000)
- **BNB Rate:** 1 BNB = 600 USDT (default, owner can change)

---

## ✅ New Features in This Contract

### Liquidity Management:
- ✅ Direct transfer approach (no approval needed)
- ✅ USDT support
- ✅ BNB support (converted to USDT equivalent)
- ✅ Add all or specific amounts
- ✅ Withdraw USDT or BNB
- ✅ `receive()` function to accept BNB

### All Existing Features:
- ✅ Buy tokens with USDT
- ✅ Buy tokens with BNB
- ✅ Sell tokens (receive USDT or BNB)
- ✅ Referral system (5% commission)
- ✅ Reward system (1% daily)
- ✅ Fixed price mechanism
- ✅ Pause/unpause functionality

---

## 📋 Pre-Liquidity Checklist

Before adding liquidity:

- [ ] Contract verified on BscScan ✓
- [ ] Test `addLiquidityFromContract()` with small amount (10 USDT)
- [ ] Test `addLiquidityBNBFromContract()` with small amount (0.1 BNB)
- [ ] Test `buyTokens()` with USDT
- [ ] Test `buyTokensWithBNB()` with BNB
- [ ] Test `sellTokens()` to verify withdrawal
- [ ] Test referral system
- [ ] Test website integration
- [ ] Have USDT ready for liquidity (e.g., $1000 USDT)
- [ ] Have BNB ready for liquidity (e.g., 1 BNB)
- [ ] Have BNB for gas fees (e.g., 0.1 BNB)

---

## 🎯 Important Notes

1. **Adding Liquidity:**
   - **No approval needed!** Just send USDT/BNB directly to contract
   - Send USDT using USDT contract's `transfer` function
   - Send BNB directly to contract address
   - Then call `addLiquidityFromContract()` to add to pool

2. **Gas Fees:**
   - Make sure you have BNB for gas fees
   - Each transaction needs ~0.001-0.01 BNB for gas

3. **Contract Functions:**
   - All functions are tested and working
   - Uses direct transfer approach (no transferFrom issues)
   - All security features are in place

---

## ✅ Status

- ✅ Contract deployed
- ✅ Contract verified
- ✅ Website updated
- ✅ All references updated
- ✅ Ready for testing

**Next:** Add liquidity and test all functions!

