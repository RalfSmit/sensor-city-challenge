'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.request = request;
exports.newJob = newJob;
exports.updateJob = updateJob;
exports.downloadJob = downloadJob;
exports.downloadFinishedJobs = downloadFinishedJobs;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _jobs = require('./jobs');

var Jobs = _interopRequireWildcard(_jobs);

var fs = require('fs');
var http = require('http');

var username = '';
exports.username = username;
var password = '';
exports.password = password;
var hostname = 'sensorcity-api.kxa.nl';

exports.hostname = hostname;

function request(_ref) {
  var path = _ref.path;
  var query = _ref.query;
  var onRequest = _ref.onRequest;

  var options = {
    hostname: hostname,
    path: path,
    port: 80,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': query.length
    }
  };

  var request = http.request(options, onRequest);

  request.on('error', function (e) {
    return console.log('Problem with request: ' + e.message);
  });
  request.write(query);
  request.end();
}

function newJob(job) {
  var path = '/newjob';

  var query = JSON.stringify({
    'username': username,
    'password': password,
    'job': job
  });

  var onData = function onData(chunk) {
    var _JSON$parse = JSON.parse(chunk);

    var error = _JSON$parse.error;
    var job = _JSON$parse.job;

    if (error) {
      console.log('Error: ' + error.message);
    } else {
      var id = job['job-id'];
      var _name = job.name;
      var _status = job.status;

      Jobs.insert({ id: id, name: _name, status: _status });
      console.log('New Job -> id: ' + id + ', status: ' + _status);
    }
  };

  var onRequest = function onRequest(response) {
    response.setEncoding('utf8');
    response.on('data', onData);
    response.on('end', function () {});
  };

  request({ query: query, path: path, onRequest: onRequest });
}

function updateJob(_ref2) {
  var id = _ref2.id;

  var path = '/status';

  var query = JSON.stringify({
    'username': username,
    'password': password,
    'job-id': id
  });

  var onData = function onData(chunk) {
    var _JSON$parse2 = JSON.parse(chunk);

    var error = _JSON$parse2.error;
    var job = _JSON$parse2.job;

    if (error) {
      console.log('Error: ' + error.message);
    } else {
      var _id = job['job-id'];
      var _status2 = job.status;

      Jobs.update({ id: _id, status: _status2 });
      console.log('Job Updated - id: ' + _id + ', status: ' + _status2);
    }
  };

  var onRequest = function onRequest(response) {
    response.setEncoding('utf8');
    response.on('data', onData);
    response.on('end', function () {});
  };

  request({ query: query, path: path, onRequest: onRequest });
}

function downloadJob(_ref3) {
  var name = _ref3.name;
  var id = _ref3.id;

  var path = '/download';

  var query = JSON.stringify({
    'username': username,
    'password': password,
    'job-id': id
  });

  var file = fs.createWriteStream(name + '.zip');

  var onRequest = function onRequest(response) {
    console.log('Downloading Job - id: ' + id);
    response.pipe(file);
    response.on('end', function () {
      return console.log('Download Completed - id: ' + id);
    });
  };

  request({ query: query, path: path, onRequest: onRequest });
}

function downloadFinishedJobs() {
  Jobs.forEach(function (obj) {
    if (obj.status === "finished") {
      downloadJob(obj);
      Jobs.remove(obj.id);
    } else {
      updateJob(obj);
    }
  });
}