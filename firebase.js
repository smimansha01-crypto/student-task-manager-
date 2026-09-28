
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBaX7cXVId2470PthT16-Y9GjuxZj-hVdk",
    authDomain: "student-task-manager-d2fff.firebaseapp.com",
    projectId: "student-task-manager-d2fff",
    storageBucket: "student-task-manager-d2fff.firebasestorage.app",
    messagingSenderId: "159244639640",
    appId: "1:159244639640:web:a5b622a1fbab4cd9435fed",
    measurementId: "G-XXDBL8GE3T"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db};