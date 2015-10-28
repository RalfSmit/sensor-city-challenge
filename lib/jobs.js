'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insert = insert;
exports.update = update;
exports.remove = remove;
exports.forEach = forEach;
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('Jobs');

db.run('CREATE TABLE IF NOT EXISTS JOBS(' + 'id INT PRIMARY KEY  NOT NULL,' + 'name           TEXT NOT NULL,' + 'status         TEXT NOT NULL)');

function insert(_ref) {
  var id = _ref.id;
  var name = _ref.name;
  var status = _ref.status;

  db.run('INSERT INTO JOBS (id, name, status) VALUES (?, ?, ?)', id, name, status);
}

function update(_ref2) {
  var id = _ref2.id;
  var status = _ref2.status;

  db.run('UPDATE JOBS SET status = ? WHERE id = ?', status, id);
}

function remove(id) {
  db.run('DELETE FROM JOBS WHERE id = ?', id);
}

function forEach(predicate) {
  db.each('SELECT * FROM JOBS', function (err, obj) {
    predicate(obj);
  });
}