var dateFormat = require('dateformat');

import * as SensorCity from './sensorcity'

const sampleOffset = 1 * 60 * 1000; // 5 min in ms
const sampleSize = 1 * 60 * 1000; // 1 min in ms

function newJobLoop() {
  let now = new Date()
  let start = new Date(now.getTime() - sampleOffset)
  let end = new Date(start.getTime() + sampleSize)
  let name = start.getTime();
  
  let job = {
    'name': name,
    'datetime-start': dateFormat(start, "yyyy-mmm-dd hh:MM:ss"),
    'datetime-end': dateFormat(end, "yyyy-mmm-dd hh:MM:ss"),
    'type':'audio',
    'sensors': [
      '167-AU-1'
    ],
    'bit-depth': 16,
    'format': 'wav'
  }

  SensorCity.newJob(job)
}

// Create a new request every 'offset'
setInterval(newJobLoop, sampleOffset)

// check if file is available and download it every 10s
setInterval(SensorCity.downloadFinishedJobs, 10 * 1000) 
