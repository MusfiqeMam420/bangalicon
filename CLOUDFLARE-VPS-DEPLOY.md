# Bangalicon Cloudflare + VPS Deploy

This setup matches your final public structure:

- `bangalicon.com` -> frontend
- `ctrl.bangalicon.com` -> admin panel
- `api.bangalicon.com` -> backend API
- `cdn.bangalicon.com` -> free public icon CDN

## 1. VPS layout

Suggested app path:

```text
/var/www/bangalicon
```

Put this whole repo there so these folders stay together:

- `bangalicon-frontend`
- `bangalicon-admin`
- `bangalicon-backend`

## 2. Cloudflare DNS

Inside Cloudflare DNS, create these records:

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| `A` | `@` | `YOUR_VPS_IP` | Proxied |
| `CNAME` | `www` | `bangalicon.com` | Proxied |
| `CNAME` | `ctrl` | `bangalicon.com` | Proxied |
| `CNAME` | `api` | `bangalicon.com` | Proxied |
| `CNAME` | `cdn` | `bangalicon.com` | Proxied |

Why this works:

- all traffic reaches the same VPS
- Nginx separates each subdomain by `server_name`
- Cloudflare hides the raw VPS IP behind the orange cloud

Cloudflare docs:

- [Proxy status](https://developers.cloudflare.com/dns/proxy-status/)
- [Full (strict) SSL mode](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)

## 3. Cloudflare SSL mode

Use:

```text
SSL/TLS mode = Full (strict)
```

That is the safest clean setup for launch.

Recommended:

1. Open Cloudflare dashboard
2. Go to `SSL/TLS`
3. Create an **Origin Certificate**
4. Save the certificate and private key on the VPS

Suggested paths:

```text
/etc/ssl/cloudflare/bangalicon-origin.pem
/etc/ssl/cloudflare/bangalicon-origin.key
```

## 4. Backend env

Create:

`/var/www/bangalicon/bangalicon-backend/.env`

Use values like:

```env
MONGODB_URI=your-mongodb-uri
MONGODB_DB_NAME=bangalicon

PORT=5100
BACKEND_URL=https://api.bangalicon.com
FRONTEND_URL=https://bangalicon.com
ADMIN_URL=https://ctrl.bangalicon.com
CORS_ORIGINS=https://bangalicon.com,https://ctrl.bangalicon.com

JWT_SECRET=replace-with-a-long-random-secret
AUTH_TOKEN_TTL=7d
AUTH_TOKEN_TTL_REMEMBER_ME=30d
PREMIUM_CDN_TOKEN_TTL=7d

GOOGLE_REDIRECT_URI=https://api.bangalicon.com/api/users/google/callback

MAIL_FROM=sammobadi1925@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=sammobadi1925@gmail.com
SMTP_PASS=your-gmail-app-password

CDN_PUBLIC_URL=https://cdn.bangalicon.com/free
CDN_PRO_PUBLIC_URL=https://api.bangalicon.com/p
ENABLE_ICON_PACKAGES_PUBLISH=false
RELEASE_VERSION=3.1.0
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://bangalicon.com/
```

Important note:

- free public assets should use `cdn.bangalicon.com`
- premium signed files should stay behind the backend signed route
- that is why `CDN_PRO_PUBLIC_URL` should point to the protected API flow, not a public static folder

## 5. Frontend env

Create:

`/var/www/bangalicon/bangalicon-frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=https://api.bangalicon.com/api
NEXT_PUBLIC_SITE_URL=https://bangalicon.com
SITE_URL=https://bangalicon.com
NEXT_PUBLIC_SHOW_PRICING=false
```

## 6. Admin env

Create:

`/var/www/bangalicon/bangalicon-admin/.env.local`

```env
NEXT_PUBLIC_API_URL=https://api.bangalicon.com/api
NEXT_PUBLIC_ADMIN_SITE_URL=https://ctrl.bangalicon.com
ADMIN_SITE_URL=https://ctrl.bangalicon.com
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
ADMIN_NAME=Bangalicon Admin
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
```

## 7. Install and build

From the repo root:

```bash
cd /var/www/bangalicon
```

Install and build each app:

```bash
cd bangalicon-backend && npm install
cd /var/www/bangalicon/bangalicon-frontend && npm install && npm run build
cd /var/www/bangalicon/bangalicon-admin && npm install && npm run build
```

The backend now includes a proper production start script:

```bash
npm start
```

## 8. Run with PM2

This repo now includes:

`/var/www/bangalicon/ecosystem.config.cjs`

Install PM2 once:

```bash
npm install -g pm2
```

Start everything:

```bash
cd /var/www/bangalicon
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Apps that will run:

- frontend on `127.0.0.1:3100`
- admin on `127.0.0.1:3101`
- backend on `127.0.0.1:5100`

## 9. Nginx reverse proxy

This repo now includes:

`/var/www/bangalicon/nginx/bangalicon.conf.example`

Copy it into Nginx:

```bash
sudo cp /var/www/bangalicon/nginx/bangalicon.conf.example /etc/nginx/sites-available/bangalicon.conf
sudo ln -s /etc/nginx/sites-available/bangalicon.conf /etc/nginx/sites-enabled/bangalicon.conf
sudo nginx -t
sudo systemctl reload nginx
```

What it does:

- `bangalicon.com` -> frontend
- `ctrl.bangalicon.com` -> admin
- `api.bangalicon.com` -> backend
- `cdn.bangalicon.com/free/*` -> static free icon CDN
- `cdn.bangalicon.com/bundle-index.json` -> public bundle index

## 10. Firewall

Only keep these public:

- `80`
- `443`

Do not expose `3000`, `3001`, or `5000` publicly.
Do not expose `3100`, `3101`, or `5100` publicly either.

## 11. Google setup

For Google sign in, add this callback:

```text
https://api.bangalicon.com/api/users/google/callback
```

## 12. Final checks

Open these live URLs:

- `https://bangalicon.com`
- `https://ctrl.bangalicon.com`
- `https://api.bangalicon.com`
- `https://cdn.bangalicon.com/free/bangalicon-free.css`

Then test:

1. signup
2. email verification
3. login
4. forgot password
5. Google sign-in
6. admin login
7. icon upload
8. search
9. collections
10. usage page CDN copy

## 13. Best first launch setup

For your first upload, the simplest stable route is:

- Cloudflare DNS in front
- one Linux VPS
- PM2 for the three apps
- Nginx for domain routing
- static free CDN served by Nginx from `bangalicon-backend/cdn/free`

That keeps your launch simple, fast, and easy to manage.
