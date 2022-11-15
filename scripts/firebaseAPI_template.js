//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyAvcpikty8xrp95e5AE1xLiRidmZyO7l7c",
  
    authDomain: "comp1800-202230-ea79d.firebaseapp.com",
  
    projectId: "comp1800-202230-ea79d",
  
    storageBucket: "comp1800-202230-ea79d.appspot.com",
  
    messagingSenderId: "519992864336",

    appId: "1:519992864336:web:254afe6c17788f56942b55"

  };
  

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();