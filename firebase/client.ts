import { getApp, getApps, initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyC1-SmP8w8kKK9UoMczdDpdElOJwPkfQdg",
  authDomain: "prepzone-59636.firebaseapp.com",
  projectId: "prepzone-59636",
  storageBucket: "prepzone-59636.firebasestorage.app",
  messagingSenderId: "754843339405",
  appId: "1:754843339405:web:19a7d3e225ba1d268230c4",
  measurementId: "G-DD2CBDPWBW"
};


const app =!getApps().length?initializeApp(firebaseConfig):getApp();
export const auth=getAuth(app)
export const db=getFirestore(app)