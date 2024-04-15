importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyBlUxCth7GnVSJ1ugmulsBa58m3WQoYU3I",
    authDomain: "tribe-corner-prod.firebaseapp.com",
    projectId: "tribe-corner-prod",
    storageBucket: "tribe-corner-prod.appspot.com",
    messagingSenderId: "828444084020",
    appId: "1:828444084020:web:4034ba44c0a40e9aa38761",
    measurementId: "G-LWPMZLVQ68",
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();