import pkg from 'express'
const express = pkg;
// import { BodyParser } from "body-parser";
// import { cors } from "cors";
// import { firebase } from "firebase";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue } from "firebase/database";
import * as csv from "csv";
import * as fs from "fs";
import * as parser from 'csv-parse'
import * as xl from "xlsx";
import * as ejs from "ejs";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
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
var num = 0;
setTimeout(() => {
    num++;
}, 1000);
app.get('/', (req, res) => {
    res.render('index/index');
});
app.get('/api/get-heart-beat', async (req, res) => {

    onValue(starCountRef, async (snapshot) => {
        app.locals.data = await snapshot.val();
    });
    res.json({ data: app.locals.data })
})
app.use(express.static(__dirname + '/public'))
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
/*
var records = []

var result = []
fs.createReadStream('./film.csv')
    .pipe(parser.parse({
        columns: true
    }))
    .on('data', data => {
        let tmp = {}
        tmp.Title = data.Title;
        tmp.Plot = data.Plot;
        tmp.Director = data.Director;
        tmp.Genre = data.Genre;
        tmp.Cast = data.Cast;
        //console.log(data)
        records.push(tmp);
    })
    .on('error', error => {
        console.log(error);
    })
    .on('end', () => {
        for (let film of records) {
            console.log(String(film.Plot).split(" ").length)
            let plot = String(film.Plot);
            let header;
            let sPlot;
            try {
                header = plot.split(".")[0] + plot.split(".")[1]
                sPlot = plot.substring(plot.split(".")[0].length + plot.split(".")[1].length + 1);
                sPlot = sPlot.trim();
            } catch (error) {
                header = plot.split(".")[0]
                sPlot = plot.substring(plot.split(".")[0].length + 1);
                sPlot = sPlot.trim();
            }
            result.push({ Movie: film.Title, Input: header });
            let cnt = 0; let len = 0;
            for (let i = 0; i < 14; i++) {
                try {
                    len += sPlot.split(" ")[cnt * 2].length + sPlot.split(" ")[cnt * 2 + 1].length
                    result.push({ Movie: film.Title, Input: header + sPlot.substring(0, len) });
                    cnt++;
                } catch (error) {
                    result.push({ Movie: film.Title, Input: header + sPlot.substring(0, len) });
                }
            }
            if ((typeof (film.Director) !== 'undefined') && (String(film.Director).toLowerCase() !== 'unknown') && (String(film.Director).trim() !== '')) { result.push({ Movie: film.Title, Input: String(film.Director) }); }
            else { result.push({ Movie: film.Title, Input: '0' }); }
            if ((typeof (film.Genre) !== 'undefined') && (String(film.Genre).toLowerCase() !== 'unknown') && (String(film.Genre).trim() !== '')) { result.push({ Movie: film.Title, Input: String(film.Genre) }); }
            else { result.push({ Movie: film.Title, Input: '0' }); }
            if ((typeof (film.Cast) !== 'undefined') && (String(film.Cast).toLowerCase() !== 'unknown') && (String(film.Cast).trim() !== '')) { result.push({ Movie: film.Title, Input: String(film.Cast) }); }
            else { result.push({ Movie: film.Title, Input: '0' }); }
            result.push({ Movie: film.Title, Input: '0' });
            result.push({ Movie: film.Title, Input: '0' });
            //console.log(result);
        }
        const worksheet = xl.utils.json_to_sheet(result)
        const workBook = xl.utils.book_new();

        xl.utils.book_append_sheet(workBook, worksheet, "records");
        xl.write(workBook, { bookType: "xlsx", type: 'binary' })
        xl.writeFile(workBook, "mrecord.xlsx")
        console.log("end reading");
    })

 */

