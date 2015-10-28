var sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('Jobs')

db.run('CREATE TABLE IF NOT EXISTS JOBS(' +
          'id INT PRIMARY KEY  NOT NULL,' +
          'name           TEXT NOT NULL,' +
          'status         TEXT NOT NULL)')

export function insert({ id, name, status }) {
  db.run('INSERT INTO JOBS (id, name, status) VALUES (?, ?, ?)', id, name, status)
}

export function update({ id, status }) {
  db.run('UPDATE JOBS SET status = ? WHERE id = ?', status, id)
}

export function remove(id) {
  db.run('DELETE FROM JOBS WHERE id = ?', id)
}

export function forEach(predicate) {
  db.each('SELECT * FROM JOBS', function(err, obj) {
    predicate(obj);
  })
}