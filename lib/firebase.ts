import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Check if the app is already initialized to avoid multiple instances
const apps = getApps();

if (!apps.length) {
  // Für lokale Entwicklung
  if (process.env.NODE_ENV === 'development') {
    initializeApp({
      projectId: 'local-dev',
      storageBucket: 'local-dev.appspot.com',
      databaseURL: 'http://localhost:8080?ns=local-dev',
    });
  } else {
    // Für Produktion
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  }
}

export const db = getFirestore(); 