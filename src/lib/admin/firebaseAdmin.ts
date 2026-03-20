import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

const ADMIN_APP_NAME = "admin";

let _app: App | undefined;
let _auth: Auth | undefined;

export function getAdminAuth(): Auth {
  if (!_auth) {
    const existing = getApps().find((app) => app.name === ADMIN_APP_NAME);
    if (existing) {
      _app = existing;
    } else {
      _app = initializeApp(
        {
          credential: cert({
            projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
            clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.ADMIN_FIREBASE_PRIVATE_KEY?.replace(
              /\\n/g,
              "\n"
            ),
          }),
        },
        ADMIN_APP_NAME
      );
    }
    _auth = getAuth(_app);
  }
  return _auth;
}
