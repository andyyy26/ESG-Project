const sql = require("../../middlewares/database/database");

async function create(data, table) {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${table} SET ?`, data, (err, res) => {
            if (err) {
                console.log(`Created ${table} error: `, err);
                return reject(err);
            }

            console.log("Created: ", { id: res.insertId, ...data });
            return resolve({ id: res.insertId, ...data });
        });
    });
}

async function findById(id, table) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${table} WHERE id = ${id}`, (err, res) => {
            if (err) {
                console.log(`finByID ${table} error: `, err);
                return reject(err);
            }

            if (res.length) {
                console.log("Data: ", res[0]);
                return resolve(res[0]);
            }
            return resolve({ kind: "not_found" });
        });
    });
}

async function getAll(table) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${table}`;
        sql.query(query, (err, res) => {
            if (err) {
                console.log(`getAll ${table} error: `, err);
                return reject(err);
            }

            console.log("Data: ", res);
            return resolve(res);
        });
    });
}

async function getByCondtion(condition, table) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${table} WHERE ${condition}`, (err, res) => {
            if (err) {
                console.log(`getByCondtion ${table} error: `, err);
                return reject(err);
            }

            console.log("Data: ", res);
            return resolve(res);
        });
    });
}

async function getFieldsByCondition(fields, condition, table) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT ${fields} FROM ${table} WHERE ${condition}`, (err, res) => {
            if (err) {
                console.log(`getFieldsByCondition ${table} error: `, err);
                return reject(err);
            }

            console.log("Data: ", res);
            return resolve(res);
        });
    });
}

async function updateByCondition(data, condition, table) {
    return new Promise((resolve, reject) => {
        sql.query(
            condition,
            (err, res) => {
                if (err) {
                    console.log(`updateById ${table} error: `, err);
                    return reject(err);
                }

                if (res.affectedRows == 0) {
                    return resolve({ kind: "not_found" });
                }

                console.log(`Updated ${table}: `, { id: data.id, ...data });
                return resolve({ id: data.id, ...data });
            }
        );
    });
}

async function remove(condition, table) {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${table} WHERE ${condition}`, (err, res) => {
            if (err) {
                console.log(`Remove ${table} error: `, err);
                return reject(err);
            }

            if (res.affectedRows == 0) {
                return resolve({ kind: "not_found" });
            }

            console.log(`Deleted ${table} with condition: `, condition);
            return resolve(res);
        });
    });
}

async function removeAll(table) {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${table}`, (err, res) => {
            if (err) {
                console.log(`removeAll ${table} error: `, err);
                return reject(err);
            }

            console.log(`Deleted ${res.affectedRows} ${table}`);
            return resolve(res);
        });
    });
}

module.exports = {
    create,
    findById,
    getAll,
    getByCondtion,
    getFieldsByCondition,
    updateByCondition,
    remove,
    removeAll
};