var fs = require('fs')
var http = require('http')

import * as Jobs from './jobs'

export let username = ''
export let password = ''
export let hostname = 'sensorcity-api.kxa.nl'

export function request({ path, query, onRequest }) {

  let options = {
    hostname: hostname,
    path: path,
    port: 80,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': query.length
    }  
  }

  let request = http.request(options, onRequest)

  request.on('error', e => console.log(`Problem with request: ${e.message}`))
  request.write(query)
  request.end()
}

export function newJob(job) {
  let path = '/newjob'

  let query = JSON.stringify({
    'username': username,
    'password': password,
    'job': job
  })  
  
  let onData = function (chunk) {
    let { error, job } = JSON.parse(chunk)

    if (error) {
      console.log(`Error: ${error.message}`)
    }
    else {
      let { 'job-id': id, name, status } = job
      
      Jobs.insert({ id, name, status })
      console.log(`New Job -> id: ${id}, status: ${status}`)
    }
  }

  let onRequest = function (response) {
    response.setEncoding('utf8')
    response.on('data', onData)
    response.on('end', function() { })
  }

  request({ query, path, onRequest })
}


export function updateJob({ id }) {
  let path = '/status'
  
  let query = JSON.stringify({
    'username': username,
    'password': password,
    'job-id': id
  })  

  let onData = function (chunk) {
    let { error, job } = JSON.parse(chunk)

    if (error) {
      console.log(`Error: ${error.message}`)
    }
    else {
      let { 'job-id': id, status } = job

      Jobs.update({ id, status })
      console.log(`Job Updated - id: ${id}, status: ${status}`)
    }
  }

  let onRequest = function (response) {
    response.setEncoding('utf8')
    response.on('data', onData)
    response.on('end', function() { })
  }

  request({ query, path, onRequest })
}


export function downloadJob({ name, id }) {
  let path = '/download'

  let query = JSON.stringify({
    'username': username,
    'password': password,
    'job-id': id
  })  
  
  let file = fs.createWriteStream(name + '.zip')

  let onRequest = function (response) {
    console.log(`Downloading Job - id: ${id}`)
    response.pipe(file)
    response.on('end', () => console.log(`Download Completed - id: ${id}`))
  }
  
  request({ query, path, onRequest })
}


export function downloadFinishedJobs() {
  Jobs.forEach(function (obj) {
    if (obj.status === "finished") {
      downloadJob(obj)
      Jobs.remove(obj.id)
    }
    else {
      updateJob(obj)
    }    
  })
}
