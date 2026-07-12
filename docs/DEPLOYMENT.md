# Mathematics Geek Deployment Steps

The Mathematics Geek platform is designed as a dual-stack web application:
1. **Frontend**: Next.js 16 (App Router), deployed on **Vercel** or any Node hosting platform.
2. **Backend**: FastAPI (Python), deployed on **Render**, **Railway**, **DigitalOcean**, or Docker.
3. **Database**: MongoDB, hosted on **MongoDB Atlas** (cloud database).

---

## 1. Database Setup (MongoDB Atlas)

1. Sign up/log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Shared Cluster (Free Tier is sufficient).
3. Under **Database Access**, create a user with read/write privileges to your database (e.g. `db_user`).
4. Under **Network Access**, whitelist `0.0.0.0/0` (or add your backend server's static IP).
5. Retrieve your connection string from the **Connect** panel. It should look like:
   `mongodb+srv://db_user:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`

---

## 2. Backend Deployment

### Option A: Railway or Render (Fastest)
1. Link your GitHub repository.
2. Add a new service pointing to the `/backend` directory.
3. Configure the following **Environment Variables**:
   * `MONGO_URL`: Your MongoDB Atlas connection URL.
   * `DB_NAME`: `"mathematics_geek"`
   * `JWT_SECRET_KEY`: Generate a secure key (`openssl rand -hex 32`).
   * `ADMIN_USERNAME`: `"admin"`
   * `ADMIN_PASSWORD`: A secure admin password.
   * `CORS_ORIGINS`: Your Vercel frontend URL (e.g., `https://mathematicsgeek.com`).
4. Set the start command to:
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option B: Docker Container
1. Build the Docker image from `/backend`:
   `docker build -t math-geek-backend ./backend`
2. Run the container:
   `docker run -d -p 8000:8000 --env-file .env math-geek-backend`

---

## 3. Database Seeding

To seed the initial blog posts, testimonials, and game templates:
1. SSH or run in your local backend directory:
   `cd database && python seed.py`
*(Make sure `.env` contains the correct `MONGO_URL` and `DB_NAME` properties before running).*

---

## 4. Frontend Deployment (Vercel)

1. Log in to [Vercel](https://vercel.com).
2. Click **New Project** and import your repository.
3. Configure the **Framework Preset** to **Next.js**.
4. Set the **Root Directory** to `frontend`.
5. Add the following **Environment Variable**:
   * `NEXT_PUBLIC_API_URL`: Your deployed FastAPI backend URL (e.g. `https://api.mathematicsgeek.com`).
6. Click **Deploy**.
7. Connect your custom domain `mathematicsgeek.com` in Vercel settings.

---

## 5. WhatsApp Business Bot Setup (Optional)

1. Create a developer account at [Meta for Developers](https://developers.facebook.com).
2. Set up the WhatsApp Business API product.
3. Obtain your **Phone Number ID** and **Access Token**.
4. Add the webhook callback in your Meta console:
   * **Callback URL**: `https://api.mathematicsgeek.com/api/whatsapp/webhook`
   * **Verify Token**: `"mathgeek_verify_token"` (or whatever value is set in your backend's `WHATSAPP_VERIFY_TOKEN`).
5. Update your backend environment variables to include:
   * `WHATSAPP_VERIFY_TOKEN`
   * `WHATSAPP_API_TOKEN`
   * `WHATSAPP_PHONE_NUMBER_ID`
