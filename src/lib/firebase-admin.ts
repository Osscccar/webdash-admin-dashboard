// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Define a type for our service account config
interface ServiceAccountConfig {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
}

// Your service account credentials
const serviceAccountConfig: ServiceAccountConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Initialize Firebase Admin
function initAdmin() {
  // Only initialize if no apps exist
  if (getApps().length === 0) {
    // Type assertion is necessary here because the Firebase Admin SDK
    // needs the ServiceAccount type from firebase-admin
    initializeApp({
      credential: cert(serviceAccountConfig as ServiceAccount)
    });
  }
  
  return {
    db: getFirestore()
  };
}

const adminApp = initAdmin();
export const adminDb = adminApp.db;