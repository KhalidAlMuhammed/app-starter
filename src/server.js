// App starter — replace with your app.
//
// Conventions enforced by the platform proxy:
//   - Listen on $PORT, bind 0.0.0.0
//   - Trust X-Auth-Email / X-Auth-Slack-Id / X-Auth-Name set by the proxy.
//   - Reject requests missing X-Auth-Email (defense in depth — should never
//     happen in production since the proxy gates everything).

import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const PORT = Number(process.env.PORT || 3000);
const app = new Hono();

app.use('*', async (c, next) => {
  const email = c.req.header('X-Auth-Email') || (process.env.NODE_ENV !== 'production' ? c.req.query('fake_email') : null);
  if (!email) return c.text('unauthorized — request did not pass through platform proxy', 401);
  c.set('user', {
    email,
    slackId: c.req.header('X-Auth-Slack-Id') || '',
    name: c.req.header('X-Auth-Name') || email,
  });
  await next();
});

app.get('/', (c) => {
  const u = c.get('user');
  return c.html(`<!doctype html>
<html><head><meta charset="utf-8"><title>Hello</title>
<style>body{font:16px/1.5 system-ui;max-width:480px;margin:8vh auto;padding:0 24px}</style>
</head><body>
  <h1>👋 Hi ${escapeHtml(u.name)}</h1>
  <p>You're signed in as <code>${escapeHtml(u.email)}</code>.</p>
  <p>Replace <code>src/server.js</code> with your app.</p>
</body></html>`);
});

app.get('/api/me', (c) => c.json(c.get('user')));

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

serve({ fetch: app.fetch, port: PORT, hostname: '0.0.0.0' }, (info) => {
  console.log(`listening on :${info.port}`);
});
