# Complete Production Deployment Guide for debanshupati.dev

This guide explains how to deploy **UPI Sathi** (React Vite Frontend + Node.js Express Socket.io Backend + MongoDB) to your custom domain **`debanshupati.dev`**.

---

## 🏛️ Recommended Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │             DNS (Cloudflare / Registrar)     │
                      │               debanshupati.dev               │
                      └──────────────────────┬───────────────────────┘
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     ▼                                               ▼
         Frontend (Vercel / Cloudflare)                 Backend (Render / Railway)
          https://debanshupati.dev                    https://api.debanshupati.dev
          (or upisathi.debanshupati.dev)
                     │                                               │
                     │  REST API Calls & Real-time WebSockets       │
                     └───────────────────────────────────────────────►
                                                                     │
                                                       ┌─────────────┴─────────────┐
                                                       ▼                           ▼
                                                MongoDB Atlas               Resend Email API
                                                (Database)                 (otp@debanshupati.dev)
```

---

## 📋 Pre-Deployment Checklist

### 1. Database (MongoDB Atlas)
If you don't already have a cloud MongoDB database:
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. Under **Database Access**, create a database user (e.g. `upisathi_admin`) with a password.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** > **Drivers** > copy your connection string:
   ```env
   DB_URL=mongodb+srv://upisathi_admin:<PASSWORD>@cluster0.xxxx.mongodb.net/upisathi?retryWrites=true&w=majority
   ```

### 2. Google OAuth Credentials (for Google Login)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Under your OAuth 2.0 Client ID, add Authorized JavaScript Origins:
   - `https://debanshupati.dev`
   - `https://www.debanshupati.dev`
   - `https://upisathi.debanshupati.dev` (if using a subdomain)
   - `http://localhost:5173` (for local dev)

---

## 🚀 Option 1: Vercel (Frontend) + Render (Backend) [Recommended — 100% Free Tier Available]

### Step 1: Deploy Backend to Render

1. Push your code to a GitHub repository (if not already done).
2. Go to [render.com](https://render.com) and click **New +** > **Web Service**.
3. Connect your repository.
4. Set the following settings:
   - **Root Directory**: `p2p_platform_backend-main/p2p_platform_backend-main` (or root if backend is in a standalone repo)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Enables secure cookies |
   | `PORT` | `4000` | (or Render's default `10000`) |
   | `DB_URL` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `SESSION_SECRET` | *(random 32+ character string)* | e.g. `your-super-secret-cookie-key-xyz` |
   | `FRONTEND_ENDPOINT` | `https://debanshupati.dev` | Your frontend URL |
   | `COOKIE_SAME_SITE` | `none` | Allows cross-origin cookies between frontend and API |
   | `COOKIE_DOMAIN` | `.debanshupati.dev` | *(Optional)* Shares cookies across `*.debanshupati.dev` |
   | `RESEND_API_KEY` | `re_your_resend_api_key_here` | Your Resend API key from resend.com |
   | `OTP_EMAILID` | `otp@debanshupati.dev` | Verified sender email |
   | `GOOGLE_CLIENT_ID` | `1040841324823-ldkla6kin9ncko6lhplsutpqhrf93k9a.apps.googleusercontent.com` | Google OAuth Client ID |

6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g. `https://upisathi-api.onrender.com` or custom domain `https://api.debanshupati.dev`).

---

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New...** > **Project**.
2. Import your GitHub repository.
3. In the project setup:
   - **Root Directory**: Select `upiSathi-react-app-main/upiSathi-react-app-main`.
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://api.debanshupati.dev` *(or your Render URL `https://your-app.onrender.com`)* |
   | `VITE_SOCKET_URL` | `https://api.debanshupati.dev` *(or your Render URL)* |
   | `VITE_GOOGLE_CLIENT_ID` | `1040841324823-ldkla6kin9ncko6lhplsutpqhrf93k9a.apps.googleusercontent.com` |
5. Click **Deploy**.

---

### Step 3: Connect your domain `debanshupati.dev`

#### A. Connect Frontend to `debanshupati.dev` (on Vercel):
1. In your Vercel Project Dashboard, go to **Settings** > **Domains**.
2. Enter `debanshupati.dev` (and `www.debanshupati.dev` or `upisathi.debanshupati.dev`).
3. Vercel will show the exact DNS records to configure at your domain registrar/DNS provider:
   - **A Record**: `@` pointing to `76.76.21.21`
   - **CNAME Record**: `www` pointing to `cname.vercel-dns.com`

#### B. Connect Backend to `api.debanshupati.dev` (on Render):
1. In your Render Web Service dashboard, go to **Settings** > **Custom Domains**.
2. Click **Add Custom Domain** and enter `api.debanshupati.dev`.
3. Add the CNAME record in your DNS provider:
   - **Type**: `CNAME`
   - **Name**: `api`
   - **Value**: Your Render service address (e.g. `upisathi-api.onrender.com`)

---

## 🖥️ Option 2: Single VPS Deployment (DigitalOcean / Hetzner / AWS Lightsail)

If you prefer hosting frontend and backend together on a single server with zero cold-starts:

### 1. DNS Setup
Point `debanshupati.dev` to your VPS public IP address (`A` record).

### 2. Nginx Configuration (`/etc/nginx/sites-available/debanshupati.dev`)
```nginx
server {
    server_name debanshupati.dev www.debanshupati.dev;

    # 1. Frontend static files
    location / {
        root /var/www/upisathi/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 2. Backend REST API
    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 3. Socket.io WebSockets
    location /socket.io/ {
        proxy_pass http://localhost:4000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. Automatic SSL with Certbot
```bash
sudo certbot --nginx -d debanshupati.dev -d www.debanshupati.dev
```

### 4. PM2 to keep backend running 24/7
```bash
cd /var/www/upisathi/backend
npm install
pm2 start app.js --name "upisathi-backend"
pm2 save
pm2 startup
```

---

## 🛠️ Files Already Prepared in this Codebase:
- [vercel.json](file:///d:/upisathi/upiSathi-react-app-main/upiSathi-react-app-main/vercel.json): SPA rewrite rules to ensure refreshing `/landing`, `/login`, or `/activity` never 404s.
- [public/_redirects](file:///d:/upisathi/upiSathi-react-app-main/upiSathi-react-app-main/public/_redirects): Netlify / Cloudflare / Render SPA fallback rule.
- [utils/cookieHelper.js](file:///d:/upisathi/p2p_platform_backend-main/p2p_platform_backend-main/utils/cookieHelper.js): Dynamic cross-origin and HTTPS production cookie support.
- [package.json](file:///d:/upisathi/p2p_platform_backend-main/p2p_platform_backend-main/package.json): Added standard `"start": "node app.js"`.
- [config/env.js](file:///d:/upisathi/p2p_platform_backend-main/p2p_platform_backend-main/config/env.js): Production host environment variable loader.
