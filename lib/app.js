'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _sensorcity = require('./sensorcity');

var SensorCity = _interopRequireWildcard(_sensorcity);

var dateFormat = require('dateformat');

var sampleOffset = 1 * 60 * 1000; // 5 min in ms
var sampleSize = 1 * 60 * 1000; // 1 min in ms

function newJobLoop() {
  var now = new Date();
  var start = new Date(now.getTime() - sampleOffset);
  var end = new Date(start.getTime() + sampleSize);
  var name = start.getTime();

  var job = {
    'name': name,
    'datetime-start': dateFormat(start, "yyyy-mmm-dd hh:MM:ss"),
    'datetime-end': dateFormat(end, "yyyy-mmm-dd hh:MM:ss"),
    'type': 'audio',
    'sensors': ['167-AU-1'],
    'bit-depth': 16,
    'format': 'wav'
  };

  SensorCity.newJob(job);
}

// Create a new request every 'offset'
setInterval(newJobLoop, sampleOffset);

// check if file is available and download it every 10s
setInterval(SensorCity.downloadFinishedJobs, 10 * 1000);