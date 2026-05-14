// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYv2RNzLeabRRkKqy2JRMZ78IeuQxqk08",
  authDomain: "brain-stromers-coaching.firebaseapp.com",
  projectId: "brain-stromers-coaching",
  storageBucket: "brain-stromers-coaching.firebasestorage.app",
  messagingSenderId: "68874877411",
  appId: "1:68874877411:web:b2d7e415104c7da11188d6",
  measurementId: "G-S5VLJQ58M1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
