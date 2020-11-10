import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  
    apiKey: "AIzaSyAt0qic8y8G8ZLbhTM5zkA64JJso4BG5MU",
    authDomain: "book-santa-ff57a.firebaseapp.com",
    databaseURL: "https://book-santa-ff57a.firebaseio.com",
    projectId: "book-santa-ff57a",
    storageBucket: "book-santa-ff57a.appspot.com",
    messagingSenderId: "146147821374",
    appId: "1:146147821374:web:66001ab6327269184bce6f"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
