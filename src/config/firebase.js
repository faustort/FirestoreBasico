// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6uJ1JSLRrowRwv2QDGVbDqsywEnu0AgU",
    authDomain: "revisaofirebase-24e47.firebaseapp.com",
    projectId: "revisaofirebase-24e47",
    storageBucket: "revisaofirebase-24e47.appspot.com",
    messagingSenderId: "941364213554",
    appId: "1:941364213554:web:4faf5eb2c503b095b6092b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);