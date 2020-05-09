const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');

const dbSource = 'db.sqlite';

const db = new sqlite3.Database(dbSource, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Conectado ao banco de dados SQLite');
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE(email)
            )`,
            (err) => {
                if (err) {} else {
                    const insert = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)'
                    db.run(insert, ["admin", "admin@example.com", md5("admin123456")]);
                    db.run(insert, ["user", "user@example.com", md5("user123456")]);
                }
            });
    }
});

module.exports = db;