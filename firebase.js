import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,signOut
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC3W-N99udYjOUvzk4ipvFVrAAhvHlUPY4",
  authDomain: "englishchat-8f15f.firebaseapp.com",
  projectId: "englishchat-8f15f",
  storageBucket: "englishchat-8f15f.appspot.com",
  messagingSenderId: "871080819587",
  appId: "1:871080819587:web:8a599ebd87b13562c8d4b6"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
