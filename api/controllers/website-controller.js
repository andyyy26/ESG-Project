const Page = require("../models/page-model");
const {
  create,
  getAll
} = require("../../middlewares/utils/db-service");
const { async } = require("crypto-random-string");

/**
 * List all
 * GET
 */
const con = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

// Create new page
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Body content can not be empty!"
    });
  }

  const { id, title, description, image, status } = req.body;
  // Create a page
  const page = new Page({
    id: id,
    title: title,
    description: description,
    image: image,
    status: status
  });

  // Save page in the database
  try {
    const result = await create(page);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Page."
    });
  }
};

exports.listAll = async(req, res) => {
  const title = req.query.title;
  try {
    const result = await getAll(title);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving pages."
    });
  }
};

exports.getContactUs = (req,res) => {
  let { firstName, lastName, email, phoneNumber, message } = req.body;
  const sql = "INSERT INTO contact (first_name, last_name, email, phone_number, message) VALUES (?,?,?,?,?)";
  con.query(sql, [firstName, lastName, email, phoneNumber, message], function (err, result) {
    if (err) throw err;
    res.status(200).json({
      success: true,
      message: 'Success',
      data: req.body,
    });
  });
};

exports.getAboutUs = (req,res) => {
  let { title, description } = req.body;
  const sql = `UPDATE testdatabase.about_us SET title = '${title}', description = '${description}' WHERE id = 'pid-01'` ;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        success:false,
        message: 'Update failed',
        data : {}
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Update Success',
      data: req.body,
    });
  });
};

exports.getActivities = (req,res) => {
  let { title, image, contents } = req.body;
  let contentArr = req.body.contents;
  let sql = '';
  for (let i = 0; i < contentArr.length; i++) {
    if (contentArr[i].action === 'DELETE') {
      sql += `DELETE FROM activities_content where id='${contentArr[i].id}';`;
      contentArr = contentArr.filter(content => content.action !== 'DELETE');
    } else if (contentArr[i].action === 'EDIT') {
      sql += `UPDATE activities_content SET label = '${contentArr[i].label}', text = '${contentArr[i].text}' WHERE id = ${contentArr[i].id};`;
    } else if (contentArr[i].id === undefined) {
      contentArr[i].id = uuidv4();
      sql += `INSERT INTO activities_content (id, label, text) VALUES ('${contentArr[i].id}', '${contentArr[i].label}', '${contentArr[i].text}');`;
    }
  }
  con.query(sql, function (err, result) {
    console.log(err);
    console.log(result);
    if (err) throw err;
    res.status(200).json({
      success: true,
      message: 'Success',
      data: {title, image, contentArr},
    });
  });
};

exports.getResources = (req, res) => {
  let resources = req.body;
  let sql = '';
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].action === 'DELETE') {
      sql += `DELETE FROM resoures where id='${resources[i].id}';`;
      resources = resources.filter(resoure => resoure.action !== 'DELETE');
    } else if (resources[i].action === 'EDIT') {
      sql += `UPDATE resoures SET title = '${resources[i].title}', description = '${resources[i].description}', image = '${resources[i].image}' WHERE id = ${resources[i].id};`;
    } else if (resources[i].id === undefined) {
      resources[i].id = uuidv4();
      sql += `INSERT INTO resoures (id, title, description, image) VALUES ('${resources[i].id}', '${resources[i].title}', '${resources[i].description}', '${resources[i].image}');`;
    }
  }
  con.query(sql, function (err, result) {
    console.log(err);
    console.log(result);
    if (err) throw err;
    res.status(200).json({
      success: true,
      message: 'Success',
      data: resources,
    });
  });
};

exports.getKnowAboutUs = (req,res) => {
  let { pid, title, boldText, description, image } = req.body;
  const sql = "INSERT INTO contact (pid, title, boldText, description, image) VALUES (?,?,?,?,?)";
  con.query(sql, [pid, title, boldText, description, image], function (err, result) {
    if (err) throw err;
    res.status(200).json({
      success: true,
      message: 'Success',
      data: req.body,
    });
  });
};

exports.getOurMission = (req, res) => {
  let {pid, missions} = req.body;
  let missionsArr = req.body.missions;
  let sql = '';
  for (let i = 0; i < missionsArr.length; i++) {
    if (missionsArr[i].action === 'DELETE') {
      sql += `DELETE FROM our_missions where id='${missionsArr[i].id}';`;
      missionsArr = missionsArr.filter(content => content.action !== 'DELETE');
    } else if (missionsArr[i].action === 'EDIT') {
      sql += `UPDATE our_missions SET title = '${missionsArr[i].title}', description = '${missionsArr[i].description}' WHERE id = ${missionsArr[i].id};`;
    } else if (missionsArr[i].id === undefined) {
      missionsArr[i].id = uuidv4();
      sql += `INSERT INTO our_missions (id, title, description) VALUES ('${missionsArr[i].id}', '${missionsArr[i].title}', '${missionsArr[i].description}');`;
    }
  }
  con.query(sql, function (err, result) {
    console.log(err);
    console.log(result);
    if (err) throw err;
    res.status(200).json({
      success: true,
      message: 'Success',
      data: missionsArr,
    });
  });
};

exports.getMainContent = (req,res) => {
  let { pid, title, content } = req.body;
  const sql = "INSERT INTO contact (pid, title, content) VALUES (?,?,?)";
  con.query(sql, [pid, title, content], function (err, result) {
    if (err) throw err;
    res.status(200).json({
      success: true,
      message: 'Success',
      data: req.body,
    });
  });
};
