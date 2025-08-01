# Fracta.city Frontend Deployment Guide

## Vercel Deployment

This guide will help you deploy the Fracta.city frontend to Vercel successfully.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare the required environment variables

### Environment Variables

Add these environment variables in your Vercel project settings:

#### Required Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# WalletConnect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=Base Testnet

# Contract Addresses (Base Testnet)
NEXT_PUBLIC_COMPLIANCE_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_DUNA_STUDIO_TOKEN_ADDRESS=0x...
```

#### Optional Variables

```bash
# Feature Flags
NEXT_PUBLIC_ENABLE_KYC=true
NEXT_PUBLIC_ENABLE_TRANSACTIONS=true
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=true

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=fracta_city
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/fracta

# Support
NEXT_PUBLIC_SUPPORT_EMAIL=support@fracta.city
NEXT_PUBLIC_SUPPORT_DISCORD=https://discord.gg/fracta
```

### Deployment Steps

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `fracta-frontend` directory

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `fracta-frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables listed above
   - Ensure they are set for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Check the deployment logs for any errors

### Common Issues & Solutions

#### Build Failures

1. **Missing Dependencies**
   ```bash
   # Ensure all dependencies are in package.json
   npm install
   npm run build
   ```

2. **TypeScript Errors**
   ```bash
   # Fix TypeScript errors locally first
   npm run lint
   npx tsc --noEmit
   ```

3. **Environment Variables**
   - Ensure all `NEXT_PUBLIC_*` variables are set in Vercel
   - Check that variable names match exactly

#### Runtime Errors

1. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Ensure backend is deployed and accessible
   - Check CORS configuration

2. **WalletConnect Issues**
   - Verify `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set
   - Check WalletConnect project configuration

3. **Blockchain Connection Issues**
   - Verify contract addresses are correct
   - Ensure network configuration matches deployment

### Post-Deployment

1. **Test Functionality**
   - Test wallet connection
   - Test property browsing
   - Test KYC flow
   - Test transactions (if enabled)

2. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor error rates
   - Check Core Web Vitals

3. **Set Up Custom Domain**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records

### Troubleshooting

#### Build Logs
Check the build logs in Vercel for specific error messages. Common issues include:
- Missing environment variables
- TypeScript compilation errors
- Dependency conflicts

#### Runtime Logs
Use Vercel's function logs to debug runtime issues:
- API route errors
- Server-side rendering issues
- Environment variable access problems

#### Local Testing
Test locally with production environment variables:
```bash
# Copy env.example to .env.local
cp env.example .env.local
# Edit .env.local with production values
npm run build
npm start
```

### Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use Vercel's environment variable system
   - Rotate sensitive keys regularly

2. **API Security**
   - Use HTTPS for all API calls
   - Implement proper CORS policies
   - Validate all user inputs

3. **Blockchain Security**
   - Verify contract addresses
   - Use testnet for development
   - Implement proper error handling

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Optimize image sizes
   - Use appropriate formats (WebP, AVIF)

2. **Bundle Optimization**
   - Monitor bundle size
   - Use dynamic imports for large components
   - Optimize third-party libraries

3. **Caching**
   - Implement proper caching headers
   - Use CDN for static assets
   - Optimize API responses

### Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel documentation
3. Check project issues on GitHub
4. Contact the development team

---

**Note**: This deployment guide assumes you have a working backend API deployed. Ensure your backend is properly configured and accessible before deploying the frontend. 