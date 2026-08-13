# Bangalicon Upload Checklist

## Live domain map

- Frontend: `https://bangalicon.com`
- Admin: `https://ctrl.bangalicon.com`
- Backend API: `https://api.bangalicon.com`
- CDN: `https://cdn.bangalicon.com`

## DNS you should create

- `bangalicon.com` -> your frontend host
- `www.bangalicon.com` -> redirect to `https://bangalicon.com`
- `ctrl.bangalicon.com` -> your admin host
- `api.bangalicon.com` -> your backend host
- `cdn.bangalicon.com` -> your CDN host or reverse proxy to backend `/cdn`

## Frontend upload

Project folder: `bangalicon-frontend`

Env values:

```env
NEXT_PUBLIC_API_URL=https://api.bangalicon.com/api
NEXT_PUBLIC_SITE_URL=https://bangalicon.com
SITE_URL=https://bangalicon.com
NEXT_PUBLIC_SHOW_PRICING=false
```

Use this live domain:

- Primary domain: `bangalicon.com`

## Admin upload

Project folder: `bangalicon-admin`

Env values:

```env
NEXT_PUBLIC_API_URL=https://api.bangalicon.com/api
NEXT_PUBLIC_ADMIN_SITE_URL=https://ctrl.bangalicon.com
ADMIN_SITE_URL=https://ctrl.bangalicon.com
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
ADMIN_NAME=Bangalicon Admin
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
```

Use this live domain:

- Primary domain: `ctrl.bangalicon.com`

## Backend upload

Project folder: `bangalicon-backend`

Required env values:

```env
MONGODB_URI=your-mongodb-uri
MONGODB_DB_NAME=bangalicon
PORT=5000
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
SMTP_PASS=your-app-password
CDN_PUBLIC_URL=https://cdn.bangalicon.com/free
CDN_PRO_PUBLIC_URL=https://cdn.bangalicon.com/pro
ENABLE_ICON_PACKAGES_PUBLISH=false
NPM_REGISTRY_URL=https://registry.npmjs.org
RELEASE_VERSION=3.1.0
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://bangalicon.com/
```

Optional backend values:

```env
PREMIUM_ACCESS_CODE=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NPM_TOKEN=
CDN_SYNC_COMMAND=
RELEASE_MONTH_LABEL=
GOOGLE_SERVICE_ACCOUNT_JSON=
GOOGLE_SERVICE_ACCOUNT=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_CLIENT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_PRIVATE_KEY=
GOOGLE_SEARCH_CONSOLE_PROPERTY=
GOOGLE_ANALYTICS_PROPERTY_ID=
GA4_PROPERTY_ID=
```

Use this live domain:

- Primary domain: `api.bangalicon.com`

## Google setup

Google sign-in callback:

```text
https://api.bangalicon.com/api/users/google/callback
```

Frontend site used in emails and auth flows:

```text
https://bangalicon.com
```

## CDN setup

The generated public icon files are already pointed to:

- `https://cdn.bangalicon.com/free`
- `https://cdn.bangalicon.com/pro`

If you are not using a separate CDN service yet, you can temporarily point `cdn.bangalicon.com` at the same backend server and proxy the `/cdn` folder.

## Upload order

1. Upload backend and confirm `https://api.bangalicon.com/api/icons` responds.
2. Upload frontend to `https://bangalicon.com`.
3. Upload admin to `https://ctrl.bangalicon.com`.
4. Point `cdn.bangalicon.com` to your CDN or backend `/cdn` output.
5. Add the Google callback URL in Google Cloud.
6. Add your SMTP password and test password reset.

## Final live checks

1. Open `https://bangalicon.com`
2. Open `https://ctrl.bangalicon.com`
3. Test login
4. Test signup email verification
5. Test password reset
6. Test Google sign-in
7. Test icon search
8. Test copy and download
9. Test release note popup
10. Test promo strip popup
11. Test admin login
12. Test icon upload
13. Test CDN CSS link from the usage page
