// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxVa4SxSiMI02cw3iuQirY6SApq-IbxzQ",
  authDomain: "fir-authproject-14970.firebaseapp.com",
  projectId: "fir-authproject-14970",
  storageBucket: "fir-authproject-14970.appspot.com",
  messagingSenderId: "448129710538",
  appId: "1:448129710538:web:c2bed1a88cc7f0b075b733"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };