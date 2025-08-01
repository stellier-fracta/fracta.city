# Deployment Fix Guide

## Issue Summary
The frontend is currently trying to connect to `localhost:8000` instead of your Render backend URL, causing connection refused errors.

## Root Cause
The `NEXT_PUBLIC_API_URL` environment variable is not set in your Vercel deployment.

## Solution Steps

### 1. Get Your Render Backend URL
- Go to your Render dashboard
- Find your backend service
- Copy the URL (should look like: `https://your-app-name.onrender.com`)

### 2. Set Vercel Environment Variables
1. Go to your Vercel dashboard
2. Select your fracta.city project
3. Go to Settings → Environment Variables
4. Add the following environment variable:

```
Name: NEXT_PUBLIC_API_URL
Value: https://your-render-backend-url.onrender.com
Environment: Production, Preview, Development
```

### 3. Redeploy
After adding the environment variable:
1. Go to Deployments tab
2. Click "Redeploy" on your latest deployment
3. Or push a new commit to trigger a new deployment

### 4. Verify the Fix
After redeployment, check that:
- The blockchain status shows "Connected" instead of "Disconnected"
- No more `ERR_CONNECTION_REFUSED` errors in the console
- API calls are going to your Render URL instead of localhost

## Additional Notes

### KYC Issue
The console also shows "KYC not approved" errors. This is expected behavior - users need to complete KYC before purchasing tokens. The KYC system is working correctly.

### Local Development
For local development, create a `.env.local` file in the `fracta-frontend` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=Base Sepolia
NEXT_PUBLIC_COMPLIANCE_MANAGER_ADDRESS=0x9E7C50EBc62f7A0C97BF8b1D3f274b58dB11aB8F
NEXT_PUBLIC_DUNA_STUDIO_TOKEN_ADDRESS=0xd312662Bd68743469dbFC9B819EA7c4Ba50aCB9b
NEXT_PUBLIC_ENABLE_KYC=true
NEXT_PUBLIC_ENABLE_TRANSACTIONS=true
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=true
```

## Files Fixed
The following files have been updated to use the environment variable instead of hardcoded localhost URLs:
- `src/lib/kyc.ts`
- `src/app/dashboard/page.tsx`
- `src/app/marketplace/[property-id]/page.tsx`

These files now use `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}` for API calls. 