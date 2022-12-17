import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,initializeAuth,
  createUserWithEmailAndPassword,browserSessionPersistence
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
export const auth = initializeAuth(app,{
  persistence: browserSessionPersistence,
  popupRedirectResolver: undefined,
});
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});



export async function signIn(email, password) {
  let response;
  await signInWithEmailAndPassword(auth, email, password).then(()=>{
    response= "success"
    response = true
  }).catch(error=>{
    
    response = error.code
         
  })
  return response
}

export async function signUp(email, password) {
  let response;
  await createUserWithEmailAndPassword(auth, email, password).then(()=>{
    response = true
  }).catch(error=>{
    switch(error.code) {
      case 'auth/email-already-in-use':
        response = 'Email already in use !'
      case 'auth/invalid-email':
        response = 'invalid email!'
            break;
      case 'auth/weak-password':
        response = 'auth/weak-password'
      default: console.log(error.code)
            break;
          }
         
  })
  return response
}
