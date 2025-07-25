// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQ1r05hT5SZpZ2V0tKREE25oPq3sFat6Y",
  authDomain: "umego-cdeab.firebaseapp.com",
  projectId: "umego-cdeab",
  storageBucket: "umego-cdeab.firebasestorage.app",
  messagingSenderId: "646183922776",
  appId: "1:646183922776:web:9c61d008a7f64da5e56e2d",
  measurementId: "G-DXHS4T1SJE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
