// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA04fuv3uimWo52atzjYylQQGZN-9VbBqI",
  authDomain: "tasknest-92975.firebaseapp.com",
  projectId: "tasknest-92975",
  storageBucket: "tasknest-92975.firebasestorage.app",
  messagingSenderId: "782805331754",
  appId: "1:782805331754:web:af1d584df45a8287427853",
  measurementId: "G-YNJ8XQ70L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore