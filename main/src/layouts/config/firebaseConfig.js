import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmvPUryTr5_aEgKSgWbDjMsLGJsvLU2WU",
  authDomain: "fir-upload-pdf-d2c3f.firebaseapp.com",
  projectId: "fir-upload-pdf-d2c3f",
  storageBucket: "fir-upload-pdf-d2c3f.firebasestorage.app",
  messagingSenderId: "652300289827",
  appId: "1:652300289827:web:8447244bfc88f850cd6e96"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };