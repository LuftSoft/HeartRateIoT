import { Beat } from './firebase.js'
import { MIN_BEAT, MAX_BEAT } from './constants.js';

// setup
const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# Beat Per Second',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },
    ]
}
var isPaused = false;
function pauseChart() {
    isPaused = isPaused ? false : true
    config.options.plugins.streaming.pause = isPaused
    // myChart.options.plugins.streaming.pause = isPaused
    // myChart.update({delay: 0});
}
export { pauseChart }
// config
const config = {
    type: 'line',
    data,
    options: {
        responsive: true,
        plugins: {
            streaming: {
                pause: isPaused
            },
            title: {
                display: true,
                text: 'Heart Rate Monitoring'
            },
        },
        //tương tác
        interaction: {
            intersect: false
        },
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    onRefresh: chart => {
                        chart.data.datasets.forEach(dataset => {
                            dataset.data.push({
                                x: Date.now(),
                                y: Beat.getValue()
                                // y: Math.floor(Math.random() * (MAX_BEAT - MIN_BEAT)) + MIN_BEAT,
                            })
                        })
                    }
                },
            },
            y: {
                // beginAtZero: false,
                min: MIN_BEAT,
                max: MAX_BEAT
            }
        }
    }
}
// render
const ctx = document.getElementById('myChart')
const myChart = new Chart(ctx, config)