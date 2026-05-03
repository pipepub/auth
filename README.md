<a id="top"></a>

[![Publish like a PRO](https://pipepub.github.io/cdn/image/logo/pipepub-full-right.png)](https://github.com/pipepub "PipePub - Publish like a PRO")

<details>
<summary>ℹ️ <b>Information</b></summary>

| Info | Details |
|------|---------|
| **Name** | [![PipePub](https://pipepub.github.io/cdn/image/badge/logo/pipepub.svg)](https://github.com/pipepub "PipePub - Publish like a PRO") |
| **Package** | ![Repository](https://pipepub.github.io/cdn/image/badge/repo/auth.svg "GitHub Repository") |
| **Version** | [![Version](https://pipepub.github.io/cdn/image/badge/version/v-1.0.0.svg)](/CHANGELOG.md#history "PipePub v.1.0.0") |
| **DOC** | [![README](https://pipepub.github.io/cdn/image/badge/doc/readme.svg)](/README.md "Documentation home") |
| **License** | [![License](https://pipepub.github.io/cdn/image/badge/license/current.svg)](/LICENSE "Free MIT license") |

</details>

<details>
<summary>📑 <b>Quick links</b></summary>

| Section |
|---------|
| [🔐 PipePub Auth](#pipepub-auth) |
| [📋 Overview](#overview) |
| [📝 User Instructions](#user-instructions) |
| [🚀 How It Works](#how-it-works) |
| [📊 Platform Support](#platform-support) |
| [🔒 Security Features](#security-features) |
| [📚 Related Repositories](#related-repositories) |
| [🏗️ Architecture](#architecture) |
| [📁 File Structure](#file-structure) |
| [📝 User Workflows](#user-workflows) |
| [🔄 Token Refresh & Notifications](#token-refresh--notifications) |
| [🚀 Adding a New Platform](#adding-a-new-platform) |
| [🧪 Testing](#testing) |
| [🔧 Development](#development) |
| [📢 Support this project](#support-this-project) |
| [©️ Copyright](#copyright) |
| [📄 License](#license) |

</details>

---

<br>

<a id="pipepub-auth"></a>

## 🔐 PipePub Auth

> *[https://auth.pipepub.com/](https://auth.pipepub.com/ "PipePub Auth")*

Centralized OAuth helper service for PipePub - Publish like a PRO

<br>

<a id="overview"></a>

## 📋 Overview

> *This service does **not** store any OAuth credentials, tokens, or user data. All sensitive information remains in the user's browser and their own GitHub repository.*

PipePub Auth is a **centralized OAuth authorization helper** that generates temporary authorization codes for platforms requiring OAuth2 authentication. All PipePub users share this single service to obtain codes, which they then exchange for access tokens within their own GitHub repositories.

<br>

<a id="user-instructions"></a>

## 📝 User Instructions

### For Platform Admins (Setting up OAuth)

1. **Register an OAuth application** on your target platform
2. **Set Redirect URI** to: `https://pipepub.github.io/auth`
3. **Copy Client ID and Client Secret**
4. **Add to GitHub secrets** in your PipePub repository:
   - `TWITTER_CLIENT_ID` (or `LINKEDIN_CLIENT_ID`, `MEDIUM_CLIENT_ID`)
   - `TWITTER_CLIENT_SECRET` (or `LINKEDIN_CLIENT_SECRET`, `MEDIUM_CLIENT_SECRET`)

### For Content Publishers (Getting Tokens)

1. **Visit** `https://pipepub.github.io/auth`
2. **Select platform** and enter your Client ID and Client Secret
3. **Click Authorize** and approve on platform
4. **Copy the temporary code**
5. **Go to your PipePub repository** → Actions → "Exchange OAuth Token"
6. **Run workflow** and paste only the code (redirect URI is automatic)
7. **Tokens are automatically saved** as repository secrets
8. **Auto-refresh starts automatically** for Twitter and Medium

### For LinkedIn Users (Special Note)

Since LinkedIn does not support auto-refresh:
- Your token expires every 60 days
- Check the `refresh.yml` workflow logs for expiry warnings
- When notified, repeat the OAuth authorization process

<br>

<a id="how-it-works"></a>

## 🚀 How It Works

1. **User visits** `pipepub/auth`
2. **Selects platform** and enters OAuth credentials
3. **Authorizes** the application on the platform's website
4. **Receives temporary code** (expires in 10 minutes)
5. **Goes to their PipePub repository** on GitHub
6. **Runs the `validator.yml` workflow** and pastes the code
7. **Workflow exchanges code** for permanent tokens
8. **Tokens are stored** as GitHub repository secrets
9. **`refresh.yml` runs every 2 hours** to auto-refresh tokens (Twitter)
10. **LinkedIn users are notified** when tokens are expiring

<br>

<a id="platform-support"></a>

## 📊 Platform Support

| Platform | Auth Type | Secret Name | Auto-Refresh | Token Lifetime |
|----------|-----------|-------------|--------------|----------------|
| **X (Twitter)** | OAuth2 | `TWITTER_TOKEN` | ✅ Yes (every 2 hours) | 2 hours |
| **Medium** | OAuth2 | `MEDIUM_TOKEN` | ✅ Yes (every 2 hours) | 30 days |
| **LinkedIn** | OAuth2 | `LINKEDIN_TOKEN` | ❌ No (manual) | 60 days |

<br>

<a id="security-features"></a>

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| **No token storage** | The auth page never stores OAuth tokens or secrets |
| **State verification** | State includes platform, client ID, master public key, timestamp, and random nonce |
| **Time-limited codes** | State expires after 10 minutes (600,000 ms) |
| **Client-side only** | All OAuth credentials stay in user's browser |
| **One-time use** | Authorization codes can only be exchanged once |
| **User-owned secrets** | Tokens are stored as GitHub secrets in user's own repository |
| **IIFE encapsulation** | JavaScript functions are not exposed globally |
| **XSS protection** | HTML escaping prevents injection attacks |
| **Session cleanup** | Sensitive data cleared from sessionStorage after successful verification |

### State Generation

```javascript
const stateObj = {
    p: platform,        // platform identifier
    c: clientId,        // user's OAuth client ID
    k: publicKey,       // master public key from config
    t: timestamp,       // creation timestamp
    r: random           // random nonce
};
const state = btoa(JSON.stringify(stateObj));
```

<br>

<a id="related-repositories"></a>

## 📚 Related Repositories

| Repository | Description |
|------------|-------------|
| [![pipepub/auth](https://pipepub.github.io/cdn/image/badge/repo/auth.svg)](https://github.com/pipepub/auth "pipepub/auth") | This repository - OAuth service (WIP) |
| [![pipepub/cdn](https://pipepub.github.io/cdn/image/badge/repo/cdn.svg)](https://github.com/pipepub/cdn "pipepub/cdn") | Centralized assets (logos, screenshots, badges) |
| [![pipepub/pipepub](https://pipepub.github.io/cdn/image/badge/repo/pipepub.svg)](https://github.com/pipepub/pipepub "pipepub/pipepub") | PipePub core — the pipeline |

<br>

<a id="architecture"></a>

## 🏗️ Architecture

**PipePub AUTH self-service**

```text
pipepub/auth
├── index.html                 # Main OAuth helper (production)
├── assets/
│   ├── config.json            # Production config
│   ├── test.json              # Test config (points to mock)
│   └── js/
│       ├── auth.js            # Main OAuth logic (supports ?test=true)
│       └── mock.js            # Mock OAuth provider logic
├── mock/
│   ├── index.html             # Mock OAuth provider page
│   └── mock.json              # Mock service specifications
├── LICENSE
└── README.md                  # This file
```

**USER repos - forked/templated**

```text
pipepub/pipepub
├── .github/workflows/
│   ├── validator.yml   # Exchange code for token (manual trigger)
│   └── refresh.yml     # Auto-refresh tokens + notifications (schedule)
└── ... (rest of PipePub)
```

<br>

<a id="file-structure"></a>

## 📁 File Structure

### config.json

PipePub auth repository: `/assets/config.json`

Central configuration file containing master public key and OAuth service definitions.

<details>
<summary>🧾 <b>view file code</b></summary>

```json
{
    "_title": "PipePub v1.0.0 OAUTH2 config and services",
    "_file": "/assets/config.json",
    "_version": "1.0.0",
    "public_key": "pipepub_v1_2026_04_30_secure_master_key",
    "services": {
        "XTwitter": {
            "name": "X (Twitter)",
            "secret_name": "TWITTER_TOKEN",
            "authorize_url": "https://twitter.com/i/oauth2/authorize",
            "token_url": "https://api.twitter.com/2/oauth2/token",
            "scope": "tweet.write users.read offline.access",
            "response_type": "code",
            "supports_refresh": true,
            "refresh_requires_offline_scope": true,
            "access_token_lifetime_hours": 2
        },
        "Linkedin": {
            "name": "LinkedIn",
            "secret_name": "LINKEDIN_TOKEN",
            "authorize_url": "https://www.linkedin.com/oauth/v2/authorization",
            "token_url": "https://www.linkedin.com/oauth/v2/accessToken",
            "scope": "w_member_social r_liteprofile",
            "response_type": "code",
            "supports_refresh": false,
            "access_token_lifetime_days": 60,
            "note": "Users must re-authenticate every 60 days via PipePub Auth"
        },
        "Medium": {
            "name": "Medium",
            "secret_name": "MEDIUM_TOKEN",
            "authorize_url": "https://medium.com/oauth/authorize",
            "token_url": "https://api.medium.com/v1/tokens",
            "scope": "basicProfile publishPost",
            "response_type": "code",
            "supports_refresh": true,
            "access_token_lifetime_days": 30
        }
    }
}
```

</details>

### Configuration Fields

| Field | Description |
|-------|-------------|
| `public_key` | Master key used for state verification across all users |
| `services` | Object containing all OAuth-enabled platforms |
| `name` | Display name of the platform |
| `secret_name` | GitHub secret name to be created (e.g., `TWITTER_TOKEN`) |
| `authorize_url` | Platform's OAuth authorization endpoint |
| `token_url` | Platform's token exchange endpoint |
| `scope` | Required OAuth scopes for publishing |
| `response_type` | Usually `code` for authorization code flow |
| `supports_refresh` | Whether platform supports automatic token refresh |
| `access_token_lifetime_hours/days` | How long token is valid |

### index.html

PipePub auth repository: `/index.html`

Main OAuth helper page that:
- Dynamically loads platform configurations
- Generates secure state parameters with master public key
- Redirects users to platform authorization pages
- Verifies callback state and displays temporary codes

### auth.js

PipePub auth repository: `/assets/js/auth.js`

IIFE-wrapped JavaScript module that:
- Encapsulates all OAuth logic (no global variables exposed)
- Prevents XSS attacks via HTML escaping
- Validates state parameters for CSRF protection
- Stores OAuth code temporarily (expires in 10 minutes)
- Clears sensitive data after successful verification

<br>

<a id="user-workflows"></a>

## 📝 User Workflows

### validator.yml - Exchange Code for Token

User's repository `.github/workflows/validator.yml`:

<details>
<summary>🧾 <b>view file code</b></summary>

```yaml
name: Exchange OAuth Token

on:
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform'
        required: true
        type: choice
        options:
          - XTwitter
          - Linkedin
          - Medium
      code:
        description: 'Authorization code from PipePub Auth'
        required: true
        type: string

jobs:
  exchange:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      secrets: write
      
    steps:
      - name: Fetch PipePub Auth config
        run: |
          curl -s https://raw.githubusercontent.com/pipepub/auth/main/assets/config.json > config.json
          
      - name: Get service configuration
        id: service_config
        run: |
          SERVICE_NAME=$(jq -r ".services[\"${{ github.event.inputs.platform }}\"].name" config.json)
          SECRET_NAME=$(jq -r ".services[\"${{ github.event.inputs.platform }}\"].secret_name" config.json)
          TOKEN_URL=$(jq -r ".services[\"${{ github.event.inputs.platform }}\"].token_url" config.json)
          SUPPORTS_REFRESH=$(jq -r ".services[\"${{ github.event.inputs.platform }}\"].supports_refresh // false" config.json)
          
          echo "service_name=$SERVICE_NAME" >> $GITHUB_OUTPUT
          echo "secret_name=$SECRET_NAME" >> $GITHUB_OUTPUT
          echo "token_url=$TOKEN_URL" >> $GITHUB_OUTPUT
          echo "supports_refresh=$SUPPORTS_REFRESH" >> $GITHUB_OUTPUT
          
      - name: Exchange code for token
        env:
          CLIENT_ID: ${{ secrets[format('{0}_CLIENT_ID', github.event.inputs.platform)] }}
          CLIENT_SECRET: ${{ secrets[format('{0}_CLIENT_SECRET', github.event.inputs.platform)] }}
        run: |
          REDIRECT_URI="https://pipepub.github.io/auth"
          
          echo "Exchanging code for ${{ steps.service_config.outputs.service_name }}..."
          
          response=$(curl -s -X POST "${{ steps.service_config.outputs.token_url }}" \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "grant_type=authorization_code" \
            -d "code=${{ github.event.inputs.code }}" \
            -d "redirect_uri=$REDIRECT_URI" \
            -d "client_id=$CLIENT_ID" \
            -d "client_secret=$CLIENT_SECRET")
          
          echo "Response: $response"
          
          ACCESS_TOKEN=$(echo "$response" | jq -r '.access_token')
          REFRESH_TOKEN=$(echo "$response" | jq -r '.refresh_token // empty')
          EXPIRES_IN=$(echo "$response" | jq -r '.expires_in // empty')
          
          if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
            echo "Failed to get access token"
            echo "Response: $response"
            exit 1
          fi
          
          echo "ACCESS_TOKEN=$ACCESS_TOKEN" >> $GITHUB_ENV
          echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> $GITHUB_ENV
          echo "EXPIRES_IN=$EXPIRES_IN" >> $GITHUB_ENV
          
      - name: Store tokens as GitHub secrets
        run: |
          SECRET_NAME="${{ steps.service_config.outputs.secret_name }}"
          SUPPORTS_REFRESH="${{ steps.service_config.outputs.supports_refresh }}"
          
          echo "$ACCESS_TOKEN" | gh secret set "$SECRET_NAME" \
            --repo "${{ github.repository }}" \
            --body -
          
          echo "✅ Access token stored as: $SECRET_NAME"
          
          if [ -n "$REFRESH_TOKEN" ] && [ "$REFRESH_TOKEN" != "null" ] && [ "$SUPPORTS_REFRESH" = "true" ]; then
            echo "$REFRESH_TOKEN" | gh secret set "${SECRET_NAME}_REFRESH" \
              --repo "${{ github.repository }}" \
              --body -
            echo "✅ Refresh token stored as: ${SECRET_NAME}_REFRESH"
          elif [ "$SUPPORTS_REFRESH" = "false" ]; then
            echo "⚠️ This platform does not support refresh tokens"
            echo "Token will expire in ${{ steps.service_config.outputs.access_token_lifetime_days }} days"
          fi
          
          if [ -n "$EXPIRES_IN" ] && [ "$EXPIRES_IN" != "null" ]; then
            EXPIRY_DATE=$(date -u -d "+${EXPIRES_IN} seconds" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+"${EXPIRES_IN}"S +"%Y-%m-%dT%H:%M:%SZ")
            echo "$EXPIRY_DATE" | gh secret set "${SECRET_NAME}_EXPIRY" \
              --repo "${{ github.repository }}" \
              --body -
            echo "✅ Expiry date stored as: ${SECRET_NAME}_EXPIRY"
          fi
          
          echo ""
          echo "=== Token Storage Complete ==="
          echo "Platform: ${{ steps.service_config.outputs.service_name }}"
          echo "Repository: ${{ github.repository }}"
          
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Summary
        run: |
          echo "## ✅ OAuth Exchange Complete" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "**Platform:** ${{ steps.service_config.outputs.service_name }}" >> $GITHUB_STEP_SUMMARY
          echo "**Access Token Secret:** \`${{ steps.service_config.outputs.secret_name }}\`" >> $GITHUB_STEP_SUMMARY
          
          if [ "${{ steps.service_config.outputs.supports_refresh }}" = "true" ]; then
            echo "**Refresh Token Secret:** \`${{ steps.service_config.outputs.secret_name }}_REFRESH\`" >> $GITHUB_STEP_SUMMARY
            echo "**Auto-refresh:** ✅ Enabled (runs every 2 hours)" >> $GITHUB_STEP_SUMMARY
          else
            echo "**Auto-refresh:** ❌ Not supported by platform" >> $GITHUB_STEP_SUMMARY
          fi
          
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Next Steps" >> $GITHUB_STEP_SUMMARY
          echo "1. The tokens are now stored in your repository secrets" >> $GITHUB_STEP_SUMMARY
          echo "2. Use PipePub to publish to ${{ steps.service_config.outputs.service_name }}" >> $GITHUB_STEP_SUMMARY
```

</details>

### refresh.yml - Auto-Refresh & Notify

User's repository `.github/workflows/refresh.yml`:

<details>
<summary>🧾 <b>view file code</b></summary>

```yaml
# refresh.yml
name: Refresh & Notify OAuth Tokens

on:
  schedule:
    - cron: '0 */2 * * *'  # Every 2 hours
  workflow_dispatch:

jobs:
  refresh-and-notify:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      secrets: write
    
    steps:
      - name: Fetch PipePub Auth config
        run: |
          curl -s https://raw.githubusercontent.com/pipepub/auth/main/assets/config.json > config.json
          
      - name: Process all services dynamically
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          SERVICES=$(jq -r '.services | keys[]' config.json)
          
          for SERVICE in $SERVICES; do
            echo "=========================================="
            echo "Processing: $SERVICE"
            echo "=========================================="
            
            SECRET_NAME=$(jq -r ".services[\"$SERVICE\"].secret_name" config.json)
            SUPPORTS_REFRESH=$(jq -r ".services[\"$SERVICE\"].supports_refresh // false" config.json)
            TOKEN_URL=$(jq -r ".services[\"$SERVICE\"].token_url" config.json)
            
            if [ "$SUPPORTS_REFRESH" = "false" ]; then
              echo "ℹ️ $SERVICE does not support auto-refresh"
              
              TOKEN=$(echo "${!SECRET_NAME}" || echo "")
              EXPIRY_SECRET="${SECRET_NAME}_EXPIRY"
              TOKEN_EXPIRY=$(echo "${!EXPIRY_SECRET}" || echo "")
              
              if [ -z "$TOKEN" ]; then
                echo "ℹ️ No $SERVICE token found - skipping"
                echo "${SERVICE}_status=skipped" >> $GITHUB_ENV
                continue
              fi
              
              if [ -n "$TOKEN_EXPIRY" ]; then
                CURRENT_EPOCH=$(date +%s)
                EXPIRY_EPOCH=$(date -d "$TOKEN_EXPIRY" +%s 2>/dev/null || echo "0")
                DAYS_LEFT=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))
                
                if [ $DAYS_LEFT -lt 0 ]; then
                  echo "::warning::$SERVICE token has EXPIRED! Please re-authenticate via PipePub Auth"
                  echo "${SERVICE}_status=expired" >> $GITHUB_ENV
                elif [ $DAYS_LEFT -lt 7 ]; then
                  echo "::warning::$SERVICE token expires in $DAYS_LEFT days. Please re-authenticate soon"
                  echo "${SERVICE}_status=warning" >> $GITHUB_ENV
                else
                  echo "✅ $SERVICE token valid for $DAYS_LEFT more days"
                  echo "${SERVICE}_status=valid" >> $GITHUB_ENV
                fi
              else
                echo "ℹ️ No expiry date for $SERVICE token"
                echo "${SERVICE}_status=unknown" >> $GITHUB_ENV
              fi
              
              continue
            fi
            
            echo "🔄 $SERVICE supports auto-refresh - attempting refresh..."
            
            CLIENT_ID_SECRET="${SERVICE}_CLIENT_ID"
            CLIENT_SECRET_SECRET="${SERVICE}_CLIENT_SECRET"
            REFRESH_TOKEN_SECRET="${SECRET_NAME}_REFRESH"
            
            CLIENT_ID="${!CLIENT_ID_SECRET}"
            CLIENT_SECRET="${!CLIENT_SECRET_SECRET}"
            REFRESH_TOKEN="${!REFRESH_TOKEN_SECRET}"
            
            if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
              echo "⚠️ $SERVICE OAuth credentials not configured - cannot refresh"
              echo "${SERVICE}_status=missing_credentials" >> $GITHUB_ENV
              continue
            fi
            
            if [ -z "$REFRESH_TOKEN" ]; then
              echo "⚠️ No refresh token found for $SERVICE"
              echo "${SERVICE}_status=missing_refresh_token" >> $GITHUB_ENV
              continue
            fi
            
            response=$(curl -s -X POST "$TOKEN_URL" \
              -H "Content-Type: application/x-www-form-urlencoded" \
              -d "grant_type=refresh_token" \
              -d "client_id=$CLIENT_ID" \
              -d "client_secret=$CLIENT_SECRET" \
              -d "refresh_token=$REFRESH_TOKEN")
            
            NEW_ACCESS_TOKEN=$(echo "$response" | jq -r '.access_token')
            NEW_REFRESH_TOKEN=$(echo "$response" | jq -r '.refresh_token')
            EXPIRES_IN=$(echo "$response" | jq -r '.expires_in // empty')
            
            if [ -n "$NEW_ACCESS_TOKEN" ] && [ "$NEW_ACCESS_TOKEN" != "null" ]; then
              echo "$NEW_ACCESS_TOKEN" | gh secret set "$SECRET_NAME" --repo "${{ github.repository }}" --body -
              echo "✅ Access token updated: $SECRET_NAME"
              
              if [ -n "$NEW_REFRESH_TOKEN" ] && [ "$NEW_REFRESH_TOKEN" != "null" ]; then
                echo "$NEW_REFRESH_TOKEN" | gh secret set "${SECRET_NAME}_REFRESH" --repo "${{ github.repository }}" --body -
                echo "✅ Refresh token updated: ${SECRET_NAME}_REFRESH"
              fi
              
              if [ -n "$EXPIRES_IN" ] && [ "$EXPIRES_IN" != "null" ]; then
                EXPIRY_DATE=$(date -u -d "+${EXPIRES_IN} seconds" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+"${EXPIRES_IN}"S +"%Y-%m-%dT%H:%M:%SZ")
                echo "$EXPIRY_DATE" | gh secret set "${SECRET_NAME}_EXPIRY" --repo "${{ github.repository }}" --body -
                echo "✅ Expiry date stored: ${SECRET_NAME}_EXPIRY"
              fi
              
              echo "✅ $SERVICE tokens refreshed successfully"
              echo "${SERVICE}_status=success" >> $GITHUB_ENV
            else
              echo "❌ Failed to refresh $SERVICE token"
              echo "${SERVICE}_status=failed" >> $GITHUB_ENV
            fi
          done
          
      - name: Summary
        run: |
          echo "## 🔄 OAuth Token Refresh Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Platform | Refresh Support | Status | Details |" >> $GITHUB_STEP_SUMMARY
          echo "|----------|----------------|--------|---------|" >> $GITHUB_STEP_SUMMARY
          
          SERVICES=$(jq -r '.services | keys[]' config.json)
          
          for SERVICE in $SERVICES; do
            SUPPORTS_REFRESH=$(jq -r ".services[\"$SERVICE\"].supports_refresh // false" config.json)
            STATUS_VAR="${SERVICE}_status"
            STATUS="${!STATUS_VAR}"
            
            REFRESH_ICON="❌"
            if [ "$SUPPORTS_REFRESH" = "true" ]; then
              REFRESH_ICON="✅"
            fi
            
            case "$STATUS" in
              success)
                echo "| $SERVICE | $REFRESH_ICON | ✅ Refreshed | Auto-refresh every 2 hours |" >> $GITHUB_STEP_SUMMARY
                ;;
              failed)
                echo "| $SERVICE | $REFRESH_ICON | ❌ Failed | Check workflow logs |" >> $GITHUB_STEP_SUMMARY
                ;;
              expired)
                echo "| $SERVICE | $REFRESH_ICON | ❌ EXPIRED | Re-authenticate via PipePub Auth |" >> $GITHUB_STEP_SUMMARY
                ;;
              warning)
                echo "| $SERVICE | $REFRESH_ICON | ⚠️ Expiring Soon | Re-authenticate within 7 days |" >> $GITHUB_STEP_SUMMARY
                ;;
              valid)
                LIFETIME=$(jq -r ".services[\"$SERVICE\"].access_token_lifetime_days // 0" config.json)
                echo "| $SERVICE | $REFRESH_ICON | ✅ Valid | Manual refresh in ${LIFETIME} days |" >> $GITHUB_STEP_SUMMARY
                ;;
              missing_credentials)
                echo "| $SERVICE | $REFRESH_ICON | ⚠️ Missing Credentials | Add ${SERVICE}_CLIENT_ID and ${SERVICE}_CLIENT_SECRET |" >> $GITHUB_STEP_SUMMARY
                ;;
              missing_refresh_token)
                echo "| $SERVICE | $REFRESH_ICON | ⚠️ Missing Token | Run Exchange OAuth Token workflow first |" >> $GITHUB_STEP_SUMMARY
                ;;
              *)
                echo "| $SERVICE | $REFRESH_ICON | ⏭️ Skipped | No token configured |" >> $GITHUB_STEP_SUMMARY
                ;;
            esac
          done
          
          echo "" >> $GITHUB_STEP_SUMMARY
          
          if grep -q "status=expired" <<< "${{ env }}"; then
            echo "::error::One or more tokens have expired! Please re-authenticate via PipePub Auth"
          fi
```

</details>

#### 🔄 Service Processing Flow

```text
For each service in config.json:
│
├── supports_refresh = false?
│   ├── YES → Check token expiry → Warn if needed → Continue
│   └── NO  → Continue to refresh flow
│
├── Check credentials exist?
│   ├── NO  → Warn → Continue
│   └── YES → Continue
│
├── Check refresh token exists?
│   ├── NO  → Warn → Continue
│   └── YES → Continue
│
└── Attempt refresh → Store new tokens → Update expiry
```

<br>

<a id="token-refresh--notifications"></a>

## 🔄 Token Refresh & Notifications

### Auto-Refresh (Twitter & Medium)

The `refresh.yml` workflow runs every 2 hours and automatically:
- Refreshes Twitter access tokens (valid 2 hours)
- Refreshes Medium access tokens (valid 30 days)
- Stores new tokens and refresh tokens

### Manual Refresh Required (LinkedIn)

LinkedIn does not provide refresh tokens for standard apps:
- Tokens expire after 60 days
- Users receive warnings 7 days before expiry
- When expired, users must re-authenticate via PipePub Auth

### Notifications

| Event | User Sees |
|-------|-----------|
| LinkedIn token expiring soon | `::warning::` in workflow logs |
| LinkedIn token expired | `::error::` in workflow logs |
| Token refresh failed | Workflow failure notification (email if configured) |
| No tokens configured | Silent skip (no spam) |

<br>

<a id="adding-a-new-platform"></a>

## 🚀 Adding a New Platform

1. **Register OAuth app** on the target platform
2. **Add to `config.json`**:

```json
"newplatform": {
    "name": "New Platform",
    "secret_name": "NEWPLATFORM_TOKEN",
    "authorize_url": "https://platform.com/oauth/authorize",
    "token_url": "https://platform.com/oauth/token",
    "scope": "required scopes",
    "response_type": "code",
    "supports_refresh": true,
    "access_token_lifetime_hours": 2
}
```

3. **No code changes needed** - The auth page and workflows automatically detect new platforms

<br>

<a id="testing"></a>

## 🧪 Testing

> *[https://auth.pipepub.com/?test=true](https://auth.pipepub.com/?test=true "PipePub Auth Test")*

PipePub Auth includes a **built-in mock OAuth server** for testing without real platform accounts.

### Test Mode Overview

| Feature | Description |
|---------|-------------|
| **Mock OAuth Provider** | Self-contained mock server that simulates OAuth2 flows |
| **No real accounts needed** | Test with any client_id/secret |
| **PKCE validation** | Tests code_challenge requirements |
| **Error simulation** | Test error handling paths |
| **Fragment-safe redirects** | Validates URL handling with `#` fragments |

### Enabling Test Mode

Add `?test=true` to the URL:

```text
https://pipepub.github.io/auth?test=true
```

A **yellow "TEST MODE" badge** appears when active.

### Test Configuration

The test environment uses `/assets/test.json` with three mock services:

| Service | Description | Use Case |
|---------|-------------|----------|
| **Local Mock OAuth Provider** | Standard OAuth2 flow | Basic testing |
| **Local Mock OAuth (PKCE Required)** | Requires `code_challenge` | Testing PKCE implementation |
| **Local Mock OAuth (No Refresh)** | No refresh token | Simulating LinkedIn behavior |

### Running Tests

#### 1. Basic OAuth Flow Test

```text
1. Visit /auth?test=true
2. Select "Local Mock OAuth Provider (MOCK)"
3. Enter any Client ID (e.g., test-client)
4. Enter any Client Secret (e.g., test-secret)
5. Click Authorize
6. Copy the returned authorization code
7. Use in your validator.yml workflow
```

#### 2. PKCE Validation Test

```text
1. Add "pkce" to the scope in test.json for MockOAuthPKCE
2. Select "Local Mock OAuth (PKCE Required)"
3. Auth.js should generate code_challenge
4. Mock validates code_challenge presence
5. Test passes if validation succeeds
```

#### 3. Error Simulation Test

```text
1. On mock page, check "Simulate OAuth Error"
2. Complete the flow
3. Should return error parameter instead of code
4. Tests your error handling logic
```

#### 4. Refresh Token Test

```text
1. On mock page, check "Omit Refresh Token"
2. Complete the flow
3. Token exchange should receive no refresh_token
4. Validates no-refresh platform handling
```

### Mock Server Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/mock/index.html` | Authorization page (auto-approve after 3 sec) |
| `https://httpbin.org/post` | Token endpoint (returns mock data) |

### Local Testing

Before deploying to GitHub Pages:

```bash
# Clone your test repo
git clone https://github.com/YOUR_USERNAME/auth-test.git
cd auth-test

# Serve locally
python3 -m http.server 8000
# or
npx serve .

# Test locally
open http://localhost:8000?test=true
```

### Verifying Production Readiness

| Test | Command | Expected |
|------|---------|----------|
| Mock flow works | `?test=true` → select mock → approve | Code returned |
| State parameter | Check mock page requestParams | State preserved |
| PKCE validation | Select PKCE mock | code_challenge present |
| Error handling | Check "Simulate Error" | error=invalid_scope |
| Fragment handling | Add `#section` to redirect_uri | URL built correctly |

### Test Repository Setup

For safe testing before production deployment:

```bash
# Create test repository on GitHub (not pipepub/auth)
# e.g., YOUR_USERNAME/pipepub-auth-test

# Push your code
git remote add test git@github.com:YOUR_USERNAME/pipepub-auth-test.git
git push test main

# Enable GitHub Pages on test repo
# Test at: https://YOUR_USERNAME.github.io/pipepub-auth-test

# After validation, push to production
git push origin main  # pipepub/auth
```

### Troubleshooting Tests

| Issue | Solution |
|-------|----------|
| Mock page not loading | Check file paths in test.json (`/mock/index.html`) |
| State verification fails | Ensure state parameter is preserved in redirect |
| PKCE validation fails | Verify code_challenge is included in auth request |
| No auto-approve | Check mock.js countdown timer |

<br>

<a id="development"></a>

## 🔧 Development

### Local Testing

```bash
# Clone the repository
git clone https://github.com/pipepub/auth.git
cd auth

# Serve locally
python3 -m http.server 8000
# or
npx serve .

# Visit http://localhost:8000
```

### Updating Configuration

1. Edit `config.json`
2. Commit and push to `main` branch
3. Changes are immediately available to all users

<br>

<a id="support-this-project"></a>

## 📢 Support this project

- ⭐ **Star** this repository
- 🔗 **Follow** [PipePub on GitHub](https://github.com/pipepub)
- 💬 **Share** with fellow writers and devs

**100% FREE**. PipePub is open source and GitHub accounts are also free.

We kindly ask that you consider making a financial contribution to support this project.

<br>

<a id="copyright"></a>

## ©️ 2026 Copyright

Built with ❤️ by [Joseba Mirena](https://www.josebamirena.com), for writers who want to focus on content, not security.

<br>

<a id="license"></a>

## 📄 License

[MIT](/LICENSE) — free to use, modify, and share.

<br>

[↑ Back to top](#top)

<!-- Related documentation persona routing -->

**Related documentation**:

[![Documentation index](https://pipepub.github.io/cdn/image/badge/doc/index.svg)](https://github.com/pipepub/pipepub/blob/main/docs/INDEX.md "Documentation index")
[![Quick Start](https://pipepub.github.io/cdn/image/badge/doc/quickstart.svg)](https://github.com/pipepub/pipepub/blob/main/docs/basics/quickstart.md "Quick Start guide")
[![FAQ](https://pipepub.github.io/cdn/image/badge/doc/faq.svg)](https://github.com/pipepub/pipepub/blob/main/docs/basics/faq.md "FAQ")
[![Security](https://pipepub.github.io/cdn/image/badge/doc/security.svg)](https://github.com/pipepub/pipepub/blob/main/docs/SECURITY.md "Security policy")
[![Contributing](https://pipepub.github.io/cdn/image/badge/doc/contributing.svg)](https://github.com/pipepub/pipepub/blob/main/.github/CONTRIBUTING.md "Contributing guide")
[![Support](https://pipepub.github.io/cdn/image/badge/doc/support.svg)](https://github.com/pipepub/pipepub/blob/main/docs/SUPPORT.md "Support guide")