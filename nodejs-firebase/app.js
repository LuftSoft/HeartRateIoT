import pkg from 'express'
const express = pkg;
// import { BodyParser } from "body-parser";
// import { cors } from "cors";
// import { firebase } from "firebase";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set } from "firebase/database";
import * as csv from "csv";
import * as fs from "fs";
import * as parser from 'csv-parse'
import * as xl from "xlsx";
import * as ejs from "ejs";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import * as nodemailer from "nodemailer";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
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

let configOptions = {
    host: "smtp.example.com",
    port: 587,
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
    }
}
let pass = 'agpmmzmqmqqxrcvf'
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "luffschloss@gmail.com",
        pass: 'agpmmzmqmqqxrcvf'
    }
})

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const starCountRef = ref(db, 'heart/realtime');
// onValue(starCountRef, (snapshot) => {
//     const data = snapshot.val();
//     console.log(data);
//     console.log(new Date(data.time));
// });
// updateStarCount(postElement, data); 
//const analytics = getAnalytics(firebaseApp);


const app = express();
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// app.engine('ejs', ejs)
// app.use(bodyParser.json())

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    console.log(req.query)
    res.render('index/index');
});
app.get('/api/get-heart-beat', async (req, res) => {
    // set(starCountRef, {
    //     begin: 1
    // })
    onValue(ref(db, "heart/heartlogs"), (snapshot) => {
        app.locals.data = snapshot.val();
    });
    let obj = app.locals.data
    var sum = 0, max = 0, min = 1000;
    for (let k in obj) {
        let tmp = Number.parseInt(obj[k]);
        if (!isNaN(tmp)) {
            sum += tmp;
            if (max < tmp) max = tmp;
            if (min > tmp) min = tmp;
        }
    }
    res.json({ data: app.locals.data })
})
app.get('/sendmail', (req, res) => {
    res.render('sendemail/sendmail')
})

app.post('/sendmail', (req, res) => {
    let mail = req.body.yourEmail
    onValue(ref(db, 'heart/heartlogs'), (snapshot) => {
        let obj = snapshot.val()
        var sum = 0, max = 0, min = 1000, cnt = 0;
        for (let k in obj) {
            let tmp = Number.parseInt(obj[k]);
            if (!isNaN(tmp)) {
                sum += tmp; cnt++;
                if (max < tmp) max = tmp;
                if (min > tmp) min = tmp;
            }
        }
        sum = sum / cnt
        const mailOption = {
            from: "luffschloss@gmail.com",
            to: mail,
            subject: `Thông báo kết quả đo nhịp tim ngày`,
            html: `
        <div>Nhịp tim trung bình: ${sum}</div>
        <div>Nhịp tim cao nhất: ${max} </div>
        <div>Nhịp tim thấp nhất: ${min}</div>
        
                `
        }
        transport.sendMail(mailOption)
            .then(() => {
                set(ref(db, 'heart/heartlogs'), {})
                set(ref(db, 'heart/realtime'), { time: "", heartbeat: "0" })

            })
            .catch((e) => {

            })
    });
    res.redirect('/?success=true')
})


app.use(express.static(__dirname + '/public'))
app.listen(3222, () => {
    console.log("Open port 3222");
})

