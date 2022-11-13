import pkg from 'express'
const express = pkg;
// import { BodyParser } from "body-parser";
// import { cors } from "cors";
// import { firebase } from "firebase";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB9kGz6N1ZSRnMNjbslbAmUVpFTmJjR5Ec",
    authDomain: "iot2022-cad90.firebaseapp.com",
    databaseURL: "https://iot2022-cad90-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot2022-cad90",
    storageBucket: "iot2022-cad90.appspot.com",
    messagingSenderId: "1000746324923",
    appId: "1:1000746324923:web:6a3ba42873be0923336a9e",
    measurementId: "G-ZMEP6HBQ0R"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const starCountRef = ref(db, 'heart/realtime');
onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    // updateStarCount(postElement, data);
});
//const analytics = getAnalytics(firebaseApp);

const app = express();



app.listen(3222, () => {
    console.log("Open port 3222");
})

/* 
Cần làm
    Chuyển time sang ngày tháng giờ.
    Có thể có 1 khảo sát nhỏ về tuổi và giới tính để xác định rủi ro về nhịp tim.
    Tạo 1 dashboard ghi log nhịp tim.
    Tại 1 giao diện nhỏ hiển thị nhịp tim realtime.
    https://firebase.google.com/docs/reference/node/firebase.database.DataSnapshot?hl=en&authuser=0
*/