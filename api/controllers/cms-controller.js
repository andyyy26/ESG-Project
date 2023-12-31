const { uploadFile } = require('../../middlewares/utils/file-uploader-service');
const _ = require("lodash");
const jwt = require('jsonwebtoken');
const {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  GOOGLE_DRIVE_URL
} = require('../../middlewares/constant/const');
const Post = require("../models/post-model");
const Form = require("../models/form-model");
const Contact = require("../models/contact-model");
const {
  allPostCondition
} = require('../../middlewares/shared/validators');
const { 
  CREATED_ERROR,
  RETRIEVE_ERROR,
  UPDATED_ERROR
 } = require('../../middlewares/constant/const');
 const {
  inputFieldEnum,
  statusEnum
} = require("../../middlewares/utils/enum");

/**
 * Upload image to Google Drive
 * POST
 */
exports.uploadImage = async (req, res) => {
  const image = req.files.image;
  await uploadFile(image)
    .then(data => {
      console.log(data)
      res.status(200).json({
        success: true,
        message: UPLOAD_IMAGE_SUCCESS,
        data: { image_url: GOOGLE_DRIVE_URL + data }
      });
    })
};

/**
 * Upload files to Google Drive
 * POST
 */
exports.uploadFile = async (req, res) => {
  const file = req.files.file;
  await uploadFile(file)
    .then(data => {
      console.log(data)
      res.status(200).json({
        success: true,
        message: UPLOAD_FILE_SUCCESS,
        data: { file_url: GOOGLE_DRIVE_URL + data },
      });
    })
};

exports.getPosts = async (req, res) => {
  let availableFiedls = {};
  let postData;
  const { limit, offset, additional_params } = req.body;
  const filterCondition = `page_id='LIB' OR page_id='ATV'`;
  try {
    if (_.isEmpty(additional_params)) {
      postData = await Post.getByCondtion(filterCondition);
      return res.status(200).json({
        message: "success",
        data: {
          total: postData.length,
          page: offset / limit + 1,
          results: postData.slice(offset, limit + offset)
        }
      });
    }

    const { query, source, category, content_type, page_id, status, start_date, end_date } = additional_params;

    if (query) {
      availableFiedls.query = query.trim();
    }

    if (source) {
      availableFiedls.source = source.trim();
    }

    if (category) {
      availableFiedls.category = category.trim();
    }

    if (content_type) {
      availableFiedls.content_type = content_type.trim();
    }

    if (page_id) {
      availableFiedls.page_id = page_id.trim();
    }

    if (status) {
      availableFiedls.status = status.trim();
    }

    if (start_date && end_date) {
      availableFiedls.time_range = `'${start_date.trim()}' AND '${end_date.trim()}'`;
    }

    let condition = "";
    const keys = Object.keys(availableFiedls)
    const conditions = keys.map(key => {
      console.log(key);
      switch (key) {
        case inputFieldEnum.QUERY:
          condition = `CONCAT_WS(content, title, source) like '%${availableFiedls[key]}%'`;
          break;
        case inputFieldEnum.TIME_RANGE:
          condition = `release_date BETWEEN ${availableFiedls[key]}`;
          break;
        case inputFieldEnum.CATEGORY:
        case inputFieldEnum.CONTENT_TYPE:
        case inputFieldEnum.PAGE_ID:
        case inputFieldEnum.SOURCE:
        case inputFieldEnum.STATUS:
          condition = `${key}='${availableFiedls[key]}'`;
          break;
        default:
          console.error("Field is not supported!!")
      }

      if (keys.indexOf(key) !== keys.length - 1) {
        condition += " AND";
      }
      return condition;
    });

    const finalCondition = conditions.join(" ") + ` AND (${filterCondition})`;
    postData = await Post.getByCondtion(finalCondition);
    res.status(200).json({
      message: "success",
      data: {
        total: postData.length,
        page: offset / limit + 1,
        results: postData.slice(offset, limit + offset)
      }
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "posts."
    });
  }
};

exports.getFormData = async (req, res) => {
  let availableFiedls = {};
  let formData;
  const fields = "id, form_id, data"

  try {
    const { limit, offset, additional_params } = req.body;
    if (_.isEmpty(additional_params)) {
      formData = await Form.getByFields(fields);
      return res.status(200).json({
        message: "success",
        data: {
          total: formData.length,
          page: offset / limit + 1,
          results: formData.slice(offset, limit + offset)
        }
      });
    }
    const { form_id } = additional_params;

    console.log(form_id)
    if (form_id) {
      availableFiedls.form_id = form_id.trim();
    }

    let condition = "";
    const keys = Object.keys(availableFiedls)
    const conditions = keys.map(key => {
      console.log(key);
      switch (key) {
        default:
          condition = `${key}='${availableFiedls[key]}'`;
      }

      if (keys.indexOf(key) !== keys.length - 1) {
        condition += " AND";
      }
      return condition;
    });

    const finalCondition = conditions.join(" ");
    formData = await Form.getFieldsByCondition(fields, finalCondition);
    res.status(200).json({
      message: "success",
      data: {
        total: formData.length,
        page: offset / limit + 1,
        results: formData.slice(offset, limit + offset)
      }
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "form data."
    });
  }
};

exports.createPost = async (req, res) => {
  const { status, additional_params } = req.body;

  if (!status || !additional_params) {
    return res.status(400).send({
      success: false,
      message: "Missing params!!!",
      data: { status, additional_params }
    });
  }

  if (status !== statusEnum.DRAFT && allPostCondition(additional_params)) {
    return res.status(400).json({
      success: false,
      message: `Please provide all required fields for post`,
      data: { status, additional_params },
    });
  }

  try {
    let postData = {
      page_id: additional_params.page_id || "",
      source: additional_params.source || "",
      title: additional_params.title || "",
      image: additional_params.image || "",
      release_date: additional_params.release_date || "",
      category: additional_params.category || "",
      content: additional_params.content || "",
      content_type: additional_params.content_type || "",
      hot_news: additional_params.hot_news || "",
      description: additional_params.description || "",
      status
    };

    const results = await Post.create(postData);
    res.status(200).json({
      success: true,
      message: 'Created post successfully',
      data: results
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message || CREATED_ERROR + "form data.",
      data: { status, additional_params }
    });
  }
};

exports.updatePost = async (req, res) => {
  const { id, status, additional_params } = req.body;

  if (!id || !status || !additional_params) {
    return res.status(400).send({
      success: false,
      message: "Missing params!!!",
      data: { id, status, additional_params }
    });
  }

  const updatedData = {
    id: id,
    page_id: additional_params.page_id || "",
    source: additional_params.source || "",
    title: additional_params.title || "",
    image: additional_params.image || "",
    release_date: additional_params.release_date || "",
    category: additional_params.category || "",
    content: additional_params.content || "",
    content_type: additional_params.content_type || "",
    hot_news: additional_params.hot_news || "",
    description: additional_params.description || "",
    status
  };

  try {
    if (status !== statusEnum.DRAFT && allPostCondition(additional_params)) {
      return res.status(400).json({
        success: false,
        message: `Please provide all required fields for post`,
        data: { status, additional_params },
      });
    }

    const updatedCondition = `page_id = ?, source = ?, title = ?, image = ?, release_date = ?, category = ?, content = ?, content_type = ?, status = ?, hot_news = ?, description = ? WHERE id = ?`
    await Post.updateByCondition(
      updatedCondition,
      [updatedData.page_id, updatedData.source, updatedData.title,
      updatedData.image, updatedData.release_date, updatedData.category,
      updatedData.content, updatedData.content_type, updatedData.status,
      updatedData.hot_news, updatedData.description, id]
    );
    res.status(200).json({
      success: true,
      message: 'Updated post successfully',
      data: updatedData
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message || UPDATED_ERROR + "post.",
      data: { status, additional_params }
    });
  }
};

exports.updateESG = async (req, res) => {
  const { page_id, content } = req.body;

  if (!page_id|| !content) {
    return res.status(400).send({
      success: false,
      message: "Missing params. Required: page_id, content!!!",
      data: null
    });
  }

  try {
    const updatedCondition = `content = ? WHERE page_id = ?`
    await Post.updateByCondition(
      updatedCondition,
      [content, page_id]
    );
    res.status(200).json({
      success: true,
      message: 'Updated ESG successfully',
      data: { page_id: page_id, content: content }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message || UPDATED_ERROR + "ESG.",
      data: { page_id, content }
    });
  }
};

exports.updateHomePage = async (req, res) => {
  const { page_id, content } = req.body;

  if (!page_id || !content) {
    return res.status(400).send({
      success: false,
      message: "Missing params. Required: page_id, content!!!",
      data: null
    });
  }

  const encodingData = jwt.sign(
    { data: content },
    process.env.JWT_SECRET
  );

  try {
    const updatedCondition = `content = ? WHERE page_id = ?`
    await Post.updateByCondition(
      updatedCondition,
      [encodingData, page_id]
    );
    res.status(200).json({
      success: true,
      message: 'Updated homepage successfully',
      data: { page_id: page_id, content: encodingData }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message || UPDATED_ERROR + "home page.",
      data: { page_id, encodingData }
    });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Missing id!!!",
      data: { id }
    });
  }

  try {
    const deletedCondition = `id = ${id}`
    const results = await Post.remove(deletedCondition);
    res.status(200).json({
      success: true,
      message: `Deleted post ${id} successfully`,
      data: results
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
      data: {id }
    });
  }
};

exports.getPostDetail = async (req, res) => {
  const { id } = req.query;
  try {
    const condition = `id='${id}'`;
    const profile = await Post.getByCondtion(condition);
    res.send(profile.pop());
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "detail."
    });
  }
};

exports.getFormDataDetail = async (req, res) => {
  const { id } = req.query;
  const fields = "id, form_id, data"
  try {
    const condition = `id='${id}'`;
    const profile = await Form.getFieldsByCondition(fields, condition);
    res.send(profile.pop());
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "detail."
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const messageList = await Contact.getAll();
    return res.status(200).json({
      message: "success",
      data: {
        total: messageList.length,
        page: offset / limit + 1,
        results: messageList.slice(offset, parseInt(limit) + parseInt(offset))
      }
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "messages."
    });
  }
};

exports.getByPageID = async (req, res) => {
  try {
    const { page_id } = req.query;
    if (!page_id) {
      return res.status(400).send({
        success: false,
        message: "Missing page_id!!!",
        data: { page_id }
      });
    }

    const condition = `page_id='${page_id}'`;
    const pageContent = await Post.getByCondtion(condition);
    res.status(200).json({
      success: true,
      message: `Get content for page ${page_id} successfully`,
      data: pageContent.shift()
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + `page ${page_id} content.`
    });
  }
};
