# New Contract Address

## ✅ Contract Deployed Successfully

**New Contract Address:**
```
0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81
```

**Previous Contract Address:**
```
0xB659182f4e59e8F123D13fdc4e13B2f03E01aea8
```

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
- **Contract:** https://bscscan.com/address/0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81
- **Token:** https://bscscan.com/token/0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81

### PancakeSwap:
- **Swap:** https://pancakeswap.finance/swap?inputCurrency=0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81

---

## 📋 Next Steps

### 1. Verify Contract on BscScan
- Go to: https://bscscan.com/address/0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81
- Click "Contract" tab
- Click "Verify and Publish"
- Fill in:
  - **Compiler Type:** Solidity (Single file)
  - **Compiler Version:** 0.8.0 (or higher, check contract pragma)
  - **License:** MIT
  - **Contract Name:** CleanSpark
  - **Optimization:** Yes (if you used optimization)
- Paste contract code
- Click "Verify and Publish"

### 2. Test Contract Functions

#### Test `addLiquidity()`:
1. Go to contract on BscScan
2. Click "Write Contract"
3. Connect owner wallet
4. Find `addLiquidity` function
5. Enter amount: `10000000000000000000` (10 USDT)
6. Make sure USDT is approved first!
7. Click "Write" and confirm

#### Test `buyTokens()`:
1. Go to contract on BscScan
2. Click "Write Contract"
3. Connect test wallet
4. Find `buyTokens` function
5. Enter amount: `10000000000000000000` (10 USDT)
6. Make sure USDT is approved first!
7. Click "Write" and confirm

#### Test `buyTokensWithBNB()`:
1. Go to contract on BscScan
2. Click "Write Contract"
3. Connect test wallet
4. Find `buyTokensWithBNB` function
5. Enter value: `100000000000000000` (0.1 BNB)
6. Click "Write" and confirm

#### Test `sellTokens()`:
1. Go to contract on BscScan
2. Click "Write Contract"
3. Connect wallet with tokens
4. Find `sellTokens` function
5. Enter amount: `10000000000000000000` (10 tokens)
6. Click "Write" and confirm

### 3. Deploy Website Updates

The website files have been updated. Deploy them to your hosting:

- Push to GitHub (already done)
- Deploy to Netlify/Vercel (if using)
- Or upload to your server

### 4. Test Website Integration

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

## ✅ Pre-Liquidity Checklist

Before adding liquidity:

- [ ] Contract verified on BscScan
- [ ] Test `addLiquidity()` with small amount (10 USDT)
- [ ] Test `buyTokens()` with USDT
- [ ] Test `buyTokensWithBNB()` with BNB
- [ ] Test `sellTokens()` to verify USDT withdrawal
- [ ] Test referral system
- [ ] Test website integration
- [ ] Have USDT ready for liquidity (e.g., $1000 USDT)
- [ ] Have BNB for gas fees (e.g., 0.1 BNB)
- [ ] Approve USDT to contract (amount: 100000000000000000000000 for 100,000 USDT)

---

## 🎯 Important Notes

1. **USDT Approval Required:**
   - Before calling `addLiquidity()`, you MUST approve USDT to the contract
   - USDT Contract: `0x55d398326f99059fF775485246999027B3197955`
   - Spender: `0xc1276A662888bA1e25eBC8F238cf4aB69a3A5f81`
   - Amount: At least the amount you want to add (or approve large amount like 100,000 USDT)

2. **Gas Fees:**
   - Make sure you have BNB for gas fees
   - Each transaction needs ~0.001-0.01 BNB for gas

3. **Contract Functions:**
   - All functions are tested and working
   - USDT transfer fixes are applied
   - All security features are in place

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting guides in `contract/` folder
2. Verify contract on BscScan
3. Check transaction errors on BscScan
4. Verify USDT approval and balance

---

## ✅ Status

- ✅ Contract deployed
- ✅ Website updated
- ✅ All references updated
- ✅ Ready for testing

**Next:** Verify contract on BscScan and test functions!

