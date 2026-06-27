import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDJsdrPl5f9kkm-9TNQR7luFFiXhx0f8o0",
  authDomain: "premiumsanseveria.firebaseapp.com",
  projectId: "premiumsanseveria",
  messagingSenderId: "210226610901",
  appId: "1:210226610901:web:5e998207584cb4928f185c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);