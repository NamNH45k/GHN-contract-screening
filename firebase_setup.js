import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVZU6gS_Ug4Ou_H-myXxbYgX0qy3aA2_w",
  authDomain: "screen-contract.firebaseapp.com",
  projectId: "screen-contract",
  storageBucket: "screen-contract.firebasestorage.app",
  messagingSenderId: "569933599420",
  appId: "1:569933599420:web:7535c530c9c9628f0b76b9",
  measurementId: "G-8WL9NC3F0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, onAuthStateChanged, signOut, collection, doc, getDoc, getDocs, setDoc, deleteDoc };
