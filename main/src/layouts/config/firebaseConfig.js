import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC2N9FblV61KYK7Co3_1mMhR1-jHQEJKvA",
    authDomain: "pdfgenerados-ea968.firebaseapp.com",
    projectId: "pdfgenerados-ea968",
    storageBucket: "pdfgenerados-ea968.firebasestorage.app",
    messagingSenderId: "668819054693",
    appId: "1:668819054693:web:f82f228d5501510850e68c",
    measurementId: "G-477J9B859S"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };