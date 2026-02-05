const admin = require('firebase-admin');

let initialized = false;

function initializeFirebase() {
  if (initialized) return admin;

  if (admin.apps.length > 0) {
    initialized = true;
    return admin;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } else {
    throw new Error(
      'Firebase config missing: set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  initialized = true;
  return admin;
}

module.exports = { initializeFirebase, getAuth: () => admin.auth() };
