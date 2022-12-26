import { MIN_BEAT, MAX_BEAT } from './constants.js';
import { showToastMessage, closeToastMessage } from './toast-message.js';
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
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
//
var btnStartStatus = 0
$('#btn_start_program').click(() => {
	if (btnStartStatus == 0) {
		set(ref(db, 'heart/init'), { run: 1 })
		$('#btn_start_program').prop('innerText', 'Tạm dừng');
		btnStartStatus = 1;
	} else {
		set(ref(db, 'heart/init'), { run: 0 })
		$('#btn_start_program').prop('innerText', 'Tiếp tục');
		btnStartStatus = 0;
	}
	// $('#btn_start_program').prop('disabled', true)
})
$('#btn_end_program').click(() => {
	set(ref(db, 'heart/init'), { run: 0 })
	if (confirm('Bạn có muốn nhận kết quả đo lần này qua mail?')) {
		location.href = "/sendmail"
	}
	else {
		set(ref(db, 'heart/heartlogs'), {})
		set(ref(db, 'heart/realtime'), { time: "", heartbeat: "0" })
		location.reload()
	}
})

// window.addEventListener('unload', (e) => {

// })
//
function setValueMonitor(beatValue) {
	var str = '';
	str = `Nhịp tim: ${beatValue} BPM`;
	document.getElementById('chartText').innerText = str;
	console.log(document.getElementById('chartText'));
}

var Beat = {
	value: 0,
	getValue() {
		onValue(starCountRef, async (snapshot) => {
			const beatValue = await snapshot.val().heartbeat;
			Beat.value = beatValue;
			setValueMonitor(beatValue);
			console.log('gọi hàm');
			if (beatValue > 100) {
				showToastMessage('toast2', 'Nhịp tim cao hơn mức bình thường!');
			} else if (beatValue < 60) {
				showToastMessage('toast2', 'Nhịp tim thấp hơn mức bình thường!');
			} else {
				closeToastMessage('toast2');
			}

		});
		return Beat.value;
	}
}

//<![CDATA[
function updateGauge(id, min, max, GaugeDisplayValue) {
	if (GaugeDisplayValue < min)
		GaugeDisplayValue = min
	if (GaugeDisplayValue > max)
		GaugeDisplayValue = max
	const newGaugeValue = Math.floor(((GaugeDisplayValue - min) / (max - min)) * 100);
	document.getElementById(id).style.setProperty('--gauge-display-value', GaugeDisplayValue);
	document.getElementById(id).style.setProperty('--gauge-value', newGaugeValue);
	if (GaugeDisplayValue > 100) {
		document.getElementById('beat-value').style.setProperty('--gauge-color', 'red')
	} else {
		document.getElementById('beat-value').style.setProperty('--gauge-color', 'white')
	}
}
//]]>

onValue(starCountRef, (snapshot) => {
	const beatValue = snapshot.val().heartbeat;
	Beat.value = beatValue;
	updateGauge('demoGauge', MIN_BEAT, MAX_BEAT, beatValue);
	if (beatValue > 100) {
		showToastMessage('toast1', 'Nhịp tim cao hơn mức bình thường!');
	} else if (beatValue < 60) {
		showToastMessage('toast1', 'Nhịp tim thấp hơn mức bình thường!');
	} else {
		closeToastMessage('toast1');
	}
});
// setInterval(() => {
// 	updateGauge('demoGauge', MIN_BEAT, MAX_BEAT, Math.floor(Math.random() * (MAX_BEAT - MIN_BEAT)) + MIN_BEAT);
// }, 500);
export { Beat };

function setToolTipGauge(min, max) {
	document.getElementById('ticks').title = `Nhịp tim có giá trị từ ${min} - ${max} bpm`;
}
setToolTipGauge(MIN_BEAT, MAX_BEAT)

