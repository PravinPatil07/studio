
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Explicit check for the API key *before* any Firebase operations
if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
  const errorMessage = 
    'CRITICAL CONFIGURATION ERROR: The Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, empty, or not a string in your environment variables. ' +
    'Firebase cannot initialize without a valid API key. ' +
    'Please ensure NEXT_PUBLIC_FIREBASE_API_KEY is correctly set in your .env file (located at the project root) AND that your Next.js server has been FULLY RESTARTED after any changes to the .env file.';
  console.error(errorMessage);
  // Throw an error to stop further execution. This makes the problem very clear.
  throw new Error(errorMessage);
}

// Log a portion of the key and the project ID being used for diagnostics
// This will only run if the above check passes (i.e., apiKey is a non-empty string)
const apiKeyPreview = apiKey.length >= 10 ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'API key (too short for preview)';
console.log(`Attempting to initialize Firebase with (from src/lib/firebase.ts):`);
console.log(`  Project ID: ${projectId || 'NOT SET (Check NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env)'}`);
console.log(`  API Key (Preview): ${apiKeyPreview}`);

if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    console.warn('WARNING: Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing or empty in your .env file. This might also cause issues.');
}

const firebaseConfig: FirebaseOptions = {
  apiKey: apiKey, // Uses the validated, non-empty apiKey from above
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("CRITICAL ERROR during Firebase initializeApp call itself:", error);
    // It's possible initializeApp itself throws if config is fundamentally broken
    // For example, if other config values are also malformed.
    throw error;
  }
} else {
  app = getApp();
}

const auth = getAuth(app); // This will now only be reached if `apiKey` was a non-empty string

export { app, auth };
