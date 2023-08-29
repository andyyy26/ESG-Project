const sql = require("../../middlewares/database/database.js");

async function create(page) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO pages SET ?", page, (err, res) => {
            if (err) {
                console.log("Create page error: ", err);
                return reject(err);
            }

            console.log("Created page: ", { id: res.insertId, ...page });
            return resolve({ id: res.insertId, ...page });
        });
    });
}

async function findById(id) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM pages WHERE id = ${id}`, (err, res) => {
            if (err) {
                console.log("finByID error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("found page: ", res[0]);
                return resolve(res[0]);
            }
            return resolve({ kind: "not_found" });
        });
    });
}

async function getAll(title) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM pages";

        if (title) {
            query += ` WHERE title LIKE '%${title}%'`;
        }

        sql.query(query, (err, res) => {
            if (err) {
                console.log("getAll error: ", err);
                return reject(err);
            }

            console.log("pages: ", res);
            return resolve(res);
        });
    });
}

async function getAllPublished() {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM pages WHERE status=published", (err, res) => {
            if (err) {
                console.log("getAllPublished error: ", err);
                return reject(err);
            }

            console.log("pages: ", res);
            return resolve(res);
        });
    });
}

async function updateById(id, page) {
    return new Promise((resolve, reject) => {
        sql.query(
            "UPDATE pages SET title = ?, description = ?, status = ? WHERE id = ?",
            [page.title, page.description, page.status, id],
            (err, res) => {
                if (err) {
                    console.log("updateById error: ", err);
                    return reject(err);
                }

                if (res.affectedRows == 0) {
                    return resolve({ kind: "not_found" });
                }

                console.log("updated page: ", { id: id, ...page });
                return resolve({ id: id, ...page });
            }
        );
    });
}

async function remove(id) {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM pages WHERE id = ?", id, (err, res) => {
            if (err) {
                console.log("remove error: ", err);
                return reject(err);
            }

            if (res.affectedRows == 0) {
                return resolve({ kind: "not_found" });
            }

            console.log("deleted page with id: ", id);
            return resolve(res);
        });
    });
}

async function removeAll() {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM pages", (err, res) => {
            if (err) {
                console.log("removeAll error: ", err);
                return reject(err);
            }

            console.log(`deleted ${res.affectedRows} pages`);
            return resolve(res);
        });
    });
}

module.exports = {
    create,
    findById,
    getAll,
    getAllPublished,
    updateById,
    remove,
    removeAll
};