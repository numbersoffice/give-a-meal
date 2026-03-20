import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const ADMIN_APP_NAME = "admin";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_ADMIN_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_ADMIN_FIREBASE_AUTH_DOMAIN,
};

function getAdminApp() {
  const existing = getApps().find((app) => app.name === ADMIN_APP_NAME);
  if (existing) return existing;
  return initializeApp(firebaseConfig, ADMIN_APP_NAME);
}

const app = getAdminApp();
const auth = getAuth(app);

export { app, auth };
