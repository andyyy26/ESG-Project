const sql = require("../../middlewares/database/database");

async function create(data, table) {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${table} SET ?`, data, (err, res) => {
            if (err) {
                console.log(`Create ${table} error: `, err);
                return reject(err);
            }

            console.log("Created: ", { id: res.insertId, ...data });
            return resolve({ id: res.insertId, ...data });
        });
    });
}

async function update(data, condition, table) {
    console.log(data, condition);
    return new Promise((resolve, reject) => {
        sql.query(`UPDATE ${table} SET ${data} WHERE ${condition}`, (err, res) => {
            console.log(JSON.stringify(res));
            if (err) {
                console.log(`Update ${table} error: `, err);
                return reject(err);
            }

            console.log("Updated: ", { res: res, ...data });
            return resolve({ res: res, ...data });
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

async function getByLimit(fields, limit, table) {
    return new Promise((resolve, reject) => {
        const query = `SELECT ${fields} FROM ${table} ${limit}`;
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
        console.log(`SELECT * FROM ${table} WHERE ${condition}`)
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

async function getByFields(fields, table) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT ${fields} FROM ${table}`, (err, res) => {
            if (err) {
                console.log(`getByFields ${table} error: `, err);
                return reject(err);
            }

            console.log("Data: ", res);
            return resolve(res);
        });
    });
}

async function getAndUnion(column, fields, values, limit, offset, table) {
    return new Promise((resolve, reject) => {
        sql.query(`
        (SELECT ${fields} FROM ${table} WHERE ${column} = '${values.EVENT}' LIMIT ${offset},${limit})
         UNION ALL
        (SELECT ${fields} FROM ${table} WHERE ${column} = '${values.NEWS}' LIMIT ${offset},${limit})
        `, (err, res) => {
            if (err) {
                console.log(`getAndUnion ${table} error: `, err);
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
            data,
            (err, res) => {
                if (err) {
                    console.log(`updateById ${table} error: `, err);
                    return reject(err);
                }

                if (res.affectedRows == 0) {
                    return resolve({ kind: "not_found" });
                }

                console.log(`Updated ${table}: `, { ...data });
                return resolve({ ...data });
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
    update,
    findById,
    getAll,
    getByLimit,
    getByCondtion,
    getByFields,
    getFieldsByCondition,
    getAndUnion,
    updateByCondition,
    remove,
    removeAll
};