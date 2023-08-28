/**
 * List all
 * GET
 */

exports.list = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'List all data',
        data: {},
      });
};

exports.getContactUs = (req,res) => {
  const con = require('../../config/database');
  console.log("Request data: ", req.body);
  let { firstName, lastName, email, phoneNumber, message } = req.body;
  console.log({ firstName, lastName, email, phoneNumber, message });
  const sql = "INSERT INTO contact (first_name, last_name, email, phone_number, message) VALUES (?,?,?,?,?)";
  con.query(sql, [firstName, lastName, email, phoneNumber, message], function (err, result) {
    if (err) throw err;
    res.status(200).json({
      success: true,
      message: 'Success',
      data: result,
    });
  });
};


