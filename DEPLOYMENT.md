# Production Deployment Guide (Netlify + Fly.io + R2)

This project is architected to run the **Frontend** on **Netlify** and the **Backend** on **Fly.io**, using **Cloudflare R2** for persistent asset storage.

## 1. Prerequisites

*   **Fly.io Account:** Install `flyctl` CLI.
*   **Netlify Account:** Connect your Git repo.
*   **Cloudflare Account:** Create an R2 bucket (e.g., `dms-prism-assets`) and enable Public Access (or connect a custom domain).
*   **Meshy API Key:** Get your key from [Meshy.ai](https://meshy.ai/).

## 2. Backend Deployment (Fly.io)

The backend handles Meshy API proxying and R2 uploads.

1.  **Navigate to server directory:**
    ```bash
    cd server
    ```

2.  **Initialize Fly App (if not already done):**
    ```bash
    fly launch --no-deploy
    ```
    *   **Name:** `dms-prism-api` (or unique name)
    *   **Region:** Choose one close to you (e.g., `lax`, `sjc`, `iad`)

3.  **Set Secrets (Critical):**
    Run the following command (replace allow-list with your Netlify URL once deployed):

    ```bash
    fly secrets set \
      MESHY_API_KEY="your_meshy_key_here" \
      R2_ACCOUNT_ID="your_cf_account_id" \
      R2_ACCESS_KEY_ID="your_r2_access_key" \
      R2_SECRET_ACCESS_KEY="your_r2_secret_key" \
      ALLOWED_ORIGINS="http://localhost:5173,https://your-site.netlify.app" \
      R2_BUCKET_NAME="dms-prism" \
      R2_PUBLIC_BASE_URL="https://pub-your-hash.r2.dev"
    ```

4.  **Deploy:**
    ```bash
    fly deploy
    ```

5.  **Verify:**
    Visit `https://dms-prism-api.fly.dev/health`. You should see `{"ok":true, "r2Configured": true, "meshyConfigured": true}`.

## 3. Frontend Deployment (Netlify)

1.  **Connect Repo:** Import your project into Netlify.
2.  **Build Settings:**
    *   **Base directory:** `(root)`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
3.  **Environment Variables:**
    Set the API base URL to point to your Fly backend:
    *   `VITE_API_BASE`: `https://dms-prism-api.fly.dev`
4.  **Deploy Site:**
    Trigger a manual deploy or push to main.

## 4. Verification Checklist

*   [ ] **Frontend Loads:** Netlify URL opens the app.
*   [ ] **Backend Health:** `/health` endpoint returns JSON with all checks passing.
*   [ ] **Create Specimen:** "Initiate Genesis" successfully triggers a preview.
*   [ ] **Refinement:** Model refinement completes and returns high-quality assets.
*   [ ] **R2 Cache:** `cache-glb` and `cache-image` calls return URLs starting with your `R2_PUBLIC_BASE_URL`.
*   [ ] **Persistence:** Reloading the page or visiting "The Yard" loads the model from the R2 URL.
