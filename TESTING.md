# Testing (Dev)

How to test a dev build of the Praxis base mini app inside the **Base mobile app**.

The flow: run the app locally → expose it with a public HTTPS URL via ngrok → paste that URL into the Base app search.

> Env vars and the database (Prisma) must already be configured. See the existing setup docs/`.env` for those values before starting.

---

## 1. Run the app locally

From the project root:

```bash
pnpm install
pnpm run dev
```

This starts Next.js on **http://localhost:3000**. Leave this terminal running.

---

## 2. Set up ngrok

ngrok gives your local server a public HTTPS URL so the Base app can reach it.

### 2.1 Create an account

1. Sign up (free) at https://dashboard.ngrok.com/signup
2. After signing in, grab your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken

### 2.2 Install (Linux)

Pick one:

```bash
# Snap
sudo snap install ngrok

# or APT
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update && sudo apt install ngrok
```

Verify:

```bash
ngrok version
```

### 2.3 Connect your authtoken (one time)

```bash
ngrok config add-authtoken <YOUR_AUTHTOKEN>
```

---

## 3. Expose the local server

In a **second terminal** (keep `pnpm run dev` running in the first):

```bash
ngrok http 3000
```

ngrok prints a public HTTPS forwarding URL, e.g.:

```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy that `https://...ngrok-free.app` URL.

> The URL changes every time you restart ngrok on the free plan, so re-copy it after each restart.

---

## 4. Open it in the Base app

1. Open the **Base** app on your phone.
2. Paste the ngrok HTTPS URL into the **search** bar.
3. Open it — the dev build loads as a mini app for testing.

---

## Quick reference

| Step | Command |
| --- | --- |
| Run app | `pnpm run dev` |
| Expose | `ngrok http 3000` |
| Paste in Base | `https://<id>.ngrok-free.app` → Base app search |
