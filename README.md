# MediConnect AI - Advanced Doctor Appointment Platform

Welcome to the **MediConnect AI** platform! This is a state-of-the-art, production-ready MERN stack application featuring futuristic Glassmorphism UI, AI integrations, Real-time WebSockets, and secure Role-Based Access Control.

## 🚀 Features Implemented
- **Ultra-Modern UI/UX**: Tailwind CSS + Framer Motion with glassmorphism, smooth page transitions, and medical-themed gradients.
- **Authentication**: Custom JWT Email/Password & Firebase Google Login with OTP.
- **Role-Based Portals**: Distinct dashboards for Patients, Doctors, and Admins.
- **AI Health Assistant**: Gemini API integrated symptom checker and health chatbot.
- **Real-Time Communication**: Socket.io live chat between patients and doctors.
- **Advanced Booking**: Calendar slot generation, confirmation flows, and payment integration.
- **Digital Health Records**: Cloudinary integration for uploading/managing prescriptions and reports.

---

## ⚙️ Setup & Configuration Guide

To get the application fully functional, you need to configure your third-party services.

### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Click **Connect** -> **Drivers** -> Copy your connection string.
3. Replace `<password>` with your database user's password.
4. Add this string to `backend/.env` as `MONGO_URI`.

### 2. Firebase Authentication Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Go to **Authentication** -> **Sign-in method** -> Enable **Email/Password** and **Google**.
3. Go to **Project Settings** -> **General** -> Scroll down to **Your apps** -> Click the Web icon `</>`.
4. Copy the `firebaseConfig` keys and paste them into `frontend/.env`.
5. Go to **Project Settings** -> **Service Accounts** -> Click **Generate new private key**.
6. Open the downloaded `.json` file, copy the `project_id`, `private_key`, and `client_email`, and paste them into `backend/.env`.

### 3. Cloudinary Setup (For Health Records/Avatars)
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account.
2. Go to the Dashboard and copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Paste these into `backend/.env`.

### 4. Gemini AI Setup (For Health Assistant)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API Key** and generate a new key.
3. Paste this key into `backend/.env` and `frontend/.env` as `GEMINI_API_KEY`.

---

## 📝 Environment Variables (.env) Examples

### Backend `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mediconnect
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI & Payments
GEMINI_API_KEY=your_gemini_key
RAZORPAY_KEY_ID=rzp_test_your_key

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

### Frontend `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Firebase Client config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abcdef

VITE_GEMINI_API_KEY=your_gemini_key
```

---

## 💻 Running the Application

Open two terminal windows.

**Terminal 1: Start the Backend**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2: Start the Frontend**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Your frontend will be available at `http://localhost:5173` and backend at `http://localhost:5000`.
