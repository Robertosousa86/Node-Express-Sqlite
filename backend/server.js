const express = require("express");
const app = express();
const db = require('./database');
const md5 = require('md5');
const bodyPaser = require('body-parser');

app.use(bodyPaser.urlencoded({
    extended: false
}));
app.use(bodyPaser.json());

const port = 8000;

app.listen(port, () => {
    console.log(`Listen in port ${port}`);
});

app.get("/api/users", (req, res, next) => {
    const sql = 'select * from user';
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({
                "Error": err.message
            });
            return;
        }
        res.json({
            "Message": "Sucess",
            "Data": rows
        });
    });
});

app.get("/api/user/:id", (req, res, next) => {
    const sql = "select * from user where id = ?"
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

app.post("/api/users/", (req, res, next) => {
    const errors = [];
    if (!req.body.password) {
        errors.push('No password especifid');
    }
    if (!req.body.email) {
        errors.push('NO Email especified');
    }
    if (errors.length) {
        res.status(400).json({
            "Erro:": errors.join(",")
        });
        return;
    }

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }

    const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    const params = [data.name, data.email, data.password];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({
                "Error": err.message
            });
            return;
        }
        res.json({
            "Message": "Sucess!",
            "Data": data,
            "Id": this.lastID
        });
    });
});

app.patch("api/user/:id", (req, res, next) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        password = COALESCE(?, password)
        WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({
                    "Error": res.message
                });
                return;
            }
            res.json({
                message: "Success",
                data: data,
                changes: this.changes
            });
        });
});

app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({
                    "error": res.message
                })
                return;
            }
            res.json({
                "message": "deleted",
                changes: this.changes
            })
        });

    app.use(function (req, res) {
        res.status(404);
    });
});