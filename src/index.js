import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyBRKL2yLsocLgIN22WzeZpnDhAZuugxFi8",
//   authDomain: "digital-menu-4310d.firebaseapp.com",
//   databaseURL: "https://digital-menu-4310d-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "digital-menu-4310d",
//   storageBucket: "digital-menu-4310d.appspot.com",
//   messagingSenderId: "531678763244",
//   appId: "1:531678763244:web:cf6866ceecc1fb5f59edc9"
// };

// firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
