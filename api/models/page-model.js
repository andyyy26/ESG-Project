const sql = require("./database.js");

const Page = function(page) {
  this.id = page.id;
  this.title = page.title;
  this.description = page.description;
  this.image = page.image;
  this.status = page.status;
};

Page.create = (page, result) => {
  sql.query("INSERT INTO pages SET ?", page, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created page: ", { id: res.insertId, ...page });
    result(null, { id: res.insertId, ...page });
  });
};

Page.findById = (id, result) => {
  sql.query(`SELECT * FROM pages WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found page: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Page.getAll = (title, result) => {
  let query = "SELECT * FROM pages";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("pages: ", res);
    result(null, res);
  });
};

Page.getAllPublished = result => {
  sql.query("SELECT * FROM pages WHERE status=published", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("pages: ", res);
    result(null, res);
  });
};

Page.updateById = (id, page, result) => {
  sql.query(
    "UPDATE pages SET title = ?, description = ?, status = ? WHERE id = ?",
    [page.title, page.description, page.status, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated page: ", { id: id, ...page });
      result(null, { id: id, ...page });
    }
  );
};

Page.remove = (id, result) => {
  sql.query("DELETE FROM pages WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted page with id: ", id);
    result(null, res);
  });
};

Page.removeAll = result => {
  sql.query("DELETE FROM pages", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} pages`);
    result(null, res);
  });
};

module.exports = Page;