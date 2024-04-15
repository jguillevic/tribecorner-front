importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyDuNMLuciC1INNmhzMEhlb5VWStT9J7Mu4",
    authDomain: "familyhub-33bd5.firebaseapp.com",
    projectId: "familyhub-33bd5",
    storageBucket: "familyhub-33bd5.appspot.com",
    messagingSenderId: "874615286570",
    appId: "1:874615286570:web:bfff3469e09088487e4c53"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();