// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlDqRVqena3lrEB53gtuEBqunkT8w3PM0",
  authDomain: "remi-remembers.firebaseapp.com",
  projectId: "remi-remembers",
  storageBucket: "remi-remembers.appspot.com",
  messagingSenderId: "957978764985",
  appId: "1:957978764985:web:30a746594fb6ebfbb35d68",
  measurementId: "G-HCGTWPXJBY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize auth config and auth code
const uiConfig = {
  signInSuccessUrl: "http://localhost:42000/home",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
