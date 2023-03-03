import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBWXp_lvfJlS-qu4m4mxwd5V24hisIRCc0",
  authDomain: "todoapp-4baa9.firebaseapp.com",
  projectId: "todoapp-4baa9",
  storageBucket: "todoapp-4baa9.appspot.com",
  messagingSenderId: "1087563736148",
  appId: "1:1087563736148:web:26a3a254aa1b09b07a79c1",
  measurementId: "G-QV8NCYFNR1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db
}
