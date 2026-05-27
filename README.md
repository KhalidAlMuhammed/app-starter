# app-starter

Minimal Hono + Docker starter for an internal web app behind a Slack-OTP
proxy. You write the app logic; the platform handles TLS, login, secrets,
and your subdomain.

## How to use this with Cursor / Claude / Codex

1. Click **Use this template** at the top of the GitHub page to create your
   own repo.
2. Open it in your editor (or paste files into Claude / Codex). Tell the AI
   tool what you want to build. **Important**: point it at this README so it
   follows the conventions below — your app won't work otherwise.
3. Push your repo to GitHub.
4. Open the deploy form your admin gave you, paste the repo URL, give it a
   name, hit deploy.

## What you write — and what's wired up for you

You write:

- `src/server.js` — your app logic. Bind to `$PORT`. Read the request
  header `X-Auth-Email` to know who's signed in. That's it.

The platform provides:

- HTTPS subdomain at `<your-app-name>.<platform-domain>`
- Login on every page — your app receives `X-Auth-Email` (no login UI to build)
- Shared API keys (Slack, Anthropic, etc.) already in your app's env vars
- Redeploy via the web form on every change

## Conventions — do NOT change these without asking the admin

These three things in `docker-compose.yml` are what lets the platform proxy
find your app. Changing them silently breaks routing:

```yaml
services:
  app:                                  # service name must be `app`
    container_name: ${APP_NAME}-app     # exact format, populated at deploy
    networks:
      - raed_platform                   # the shared platform network
```

## Running locally (no platform)

```bash
npm install
PORT=3000 npm run dev
# visit http://localhost:3000/?fake_email=you@work.example
```

The `?fake_email=…` querystring stands in for the `X-Auth-Email` header when
`NODE_ENV !== 'production'`, so you can test logged-in flows without the
proxy.
