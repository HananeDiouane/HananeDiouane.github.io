# Email Setup Guide

This guide explains how to set up `contact@hananediouane.com` for free using **Cloudflare Email Routing** with **Gmail** as the backend.

**Privacy Rule:** No personal email address appears anywhere in the codebase, HTML output, or configuration files. Only `contact@hananediouane.com` is used publicly.

---

## Overview

| Component | Service | Cost |
|-----------|---------|------|
| Email forwarding (receive) | Cloudflare Email Routing | Free |
| Send as (reply) | Gmail "Send mail as" | Free |
| Contact form backend | Formspree | Free (50 submissions/month) |

---

## Step 1 — Cloudflare Email Routing (Receive Emails)

### 1.1 Add Domain to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Add a site** → Enter `hananediouane.com`
3. Select **Free** plan
4. Cloudflare will scan DNS records — click **Continue**

### 1.2 Update Nameservers

1. Cloudflare will display two nameservers (e.g., `ada.ns.cloudflare.com`, `brett.ns.cloudflare.com`)
2. Go to your domain registrar (where you bought hananediouane.com)
3. Find **Nameservers** settings
4. Replace existing nameservers with Cloudflare's nameservers
5. Save changes — propagation takes 1-24 hours

### 1.3 Enable Email Routing

1. In Cloudflare Dashboard, select your domain
2. Go to **Email** → **Email Routing**
3. Click **Enable Email Routing**
4. Cloudflare will automatically add required MX and TXT records

### 1.4 Create Custom Email Address

1. In **Email Routing** → **Routing rules**
2. Under **Custom addresses**, click **Create address**
3. **Address:** `contact`
4. **Destination:** Your personal Gmail address
5. Click **Save**

### 1.5 Verify Destination Email

1. Check your Gmail inbox for a verification email from Cloudflare
2. Click the verification link
3. Your `contact@hananediouane.com` → Gmail forwarding is now active

---

## Step 2 — Gmail "Send As" (Reply with Custom Email)

This allows you to reply to emails using `contact@hananediouane.com` as the sender.

### 2.1 Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### 2.2 Generate App Password

1. Go to [Google Account → App passwords](https://myaccount.google.com/apppasswords)
2. Sign in if prompted
3. Click **Create** (or "Select app" → "Mail")
4. Name it: `Cloudflare Email`
5. Google will display a 16-character password — **copy it**

### 2.3 Configure "Send mail as"

1. Open [Gmail](https://mail.google.com)
2. Click **Settings** (gear icon) → **See all settings**
3. Go to **Accounts and Import** tab
4. Find **"Send mail as"** section → Click **Add another email address**
5. Enter:
   - **Name:** Hanane Diouane
   - **Email address:** `contact@hananediouane.com`
   - **Treat as an alias:** ✓ (checked)
6. Click **Next Step**
7. Enter SMTP settings:
   - **SMTP Server:** `smtp.gmail.com`
   - **Port:** `587`
   - **Username:** Your full Gmail address (e.g., `yourname@gmail.com`)
   - **Password:** The 16-character App Password from Step 2.2
   - **Secured connection using:** TLS
8. Click **Add Account**

### 2.4 Verify Email Address

1. Gmail will send a verification email to `contact@hananediouane.com`
2. This email will be forwarded to your Gmail via Cloudflare (from Step 1)
3. Click the verification link or enter the confirmation code
4. Done! You can now send emails as `contact@hananediouane.com`

---

## Step 3 — Add SPF Record (Prevent Spam Filtering)

SPF tells email providers that Gmail is authorized to send emails on behalf of `hananediouane.com`.

### 3.1 Add SPF TXT Record

1. In Cloudflare Dashboard → **DNS** → **Records**
2. Click **Add Record**
3. Enter:
   - **Type:** `TXT`
   - **Name:** `@` (or leave blank)
   - **Content:** `v=spf1 include:_spf.google.com ~all`
   - **Proxy status:** Proxied (orange cloud) or DNS only — either works for TXT
4. Click **Save**

---

## Step 4 — Formspree (Contact Form Backend)

The contact form uses Formspree to send submissions to your email without exposing any email address in the frontend code.

### 4.1 Create Formspree Account

1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Verify your email

### 4.2 Create a New Form

1. In Formspree Dashboard, click **New Form**
2. Name it: `Contact Form`
3. Click **Create Form**
4. You'll see an endpoint URL like: `https://formspree.io/f/xyzabcde`
5. Copy the **Form ID** (the `xyzabcde` part)

### 4.3 Configure Notification Email

1. In your form settings, go to **Notifications**
2. Set the **Email Recipient** to: `contact@hananediouane.com`
3. This ensures form submissions are forwarded to your Gmail via Cloudflare

### 4.4 Update Code

1. Open `src/App.jsx`
2. Find the line:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/{FORM_ID}';
   ```
3. Replace `{FORM_ID}` with your actual Form ID:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyzabcde';
   ```
4. Commit and push the change

---

## Step 5 — Testing

### 5.1 Test Email Forwarding

1. Send a test email from any account to `contact@hananediouane.com`
2. Check your Gmail inbox — the email should arrive within seconds
3. Verify the "To" field shows `contact@hananediouane.com`

### 5.2 Test "Send As"

1. In Gmail, compose a new email
2. Click the "From" field and select `contact@hananediouane.com`
3. Send a test email to yourself at another address
4. Verify the sender shows `contact@hananediouane.com`

### 5.3 Test Contact Form

1. Deploy the updated site
2. Go to the Contact section
3. Fill out and submit the form
4. Check your Gmail — you should receive the Formspree notification
5. Reply to the form submission using `contact@hananediouane.com`

---

## Troubleshooting

### Emails not arriving in Gmail
- Check Cloudflare Email Routing → **Logs** for delivery status
- Verify the destination email is verified
- Check Gmail **Spam** folder

### "Send As" verification email not arriving
- Wait a few minutes (Cloudflare forwarding can have slight delay)
- Check Spam folder
- Resend verification from Gmail settings

### Formspree form submissions not arriving
- Check Formspree Dashboard → **Submissions** for received forms
- Verify notification email is set to `contact@hananediouane.com`
- Check Formspree spam folder

### Emails marked as spam
- Ensure SPF record is configured (Step 3)
- Consider adding DKIM record (advanced — search "Gmail DKIM Cloudflare")

---

## Summary

| Feature | Status |
|---------|--------|
| Receive emails at contact@hananediouane.com | ✓ Cloudflare → Gmail forwarding |
| Send emails as contact@hananediouane.com | ✓ Gmail "Send mail as" |
| Contact form submissions | ✓ Formspree → contact@hananediouane.com |
| SPF authentication | ✓ DNS TXT record |
| Personal email privacy | ✓ Never exposed anywhere |

Your professional email `contact@hananediouane.com` is now fully configured at zero cost.
