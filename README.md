# raed-app-template

Starter for apps that run on the Raed Apps Platform (`*.apps.raed.vc`).

## How to use this with Cursor / Claude / Codex

1. Copy this directory into a new git repo on your GitHub account.
2. Open it in Cursor (or paste it into Claude / Codex). Tell the AI tool
   what you want to build. Point it at `docs/CONTRACT.md` so it follows
   the platform's conventions.
3. Push to GitHub.
4. On the VM, run:

   ```bash
   raed-bootstrap <app-name> https://github.com/<you>/<repo>.git
   ```

That's it — your app is live at `https://<app-name>.apps.raed.vc`.

## What's already wired up

- **Auth**: every request arrives with `X-Auth-Email`, `X-Auth-Slack-Id`,
  `X-Auth-Name`. No login UI to build.
- **Secrets**: drop them in GCP Secret Manager; the deploy script writes
  `.env` for you.
- **TLS**: handled by the platform proxy.
- **Subdomain**: yours, by name.

## What you write

Just the app logic. Files in this template you can keep or replace:

- `Dockerfile` — Node 20 Alpine, `node src/server.js` (rewrite if you want
  Python / Go / whatever, as long as you bind to `$PORT`)
- `docker-compose.yml` — joins `raed_platform` network, sets container name.
  **Don't change `container_name` or the network** — bootstrap & the proxy
  rely on those.
- `src/server.js` — Hello world. Replace with your app.

## Running locally

```bash
npm install
SLACK_BOT_TOKEN=... AUTH_JWT_SECRET=... npm run dev
# visit http://localhost:3000
# (locally, X-Auth-Email won't be set — use a fallback like ?fake_email=you@raed.vc)
```
