const { uploadFile } = require('../../middlewares/utils/file-uploader-service');
const _ = require("lodash");
const {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  GOOGLE_DRIVE_URL
} = require('../../middlewares/constant/const');
const Post = require("../models/post-model");
const Form = require("../models/form-model");
const {
  allPostCondition,
  customPostCondition
} = require('../../middlewares/shared/validators');
const { 
  CREATED_ERROR,
  RETRIEVE_ERROR,
  UPDATED_ERROR
 } = require('../../middlewares/constant/const');

const fieldEnum = {
  QUERY: "query",
  SOURCE: "source",
  CATEGORY: "category",
  CONTENT_TYPE: "content_type",
  TIME_RANGE: "time_range",
  PAGE_ID: "page_id",
  STATUS: "status"
}

const postEnum = {
  PUBLISH: "PUBLISH",
  DRAFT: "DRAFT"
}

const pageEnum = {
  LIB: "LIB",
  ACTIVITIES: "ATV",
  ESG: "ESG"
}

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
  const limitCondition = `LIMIT ${offset},${limit}`;

  try {
    if (_.isEmpty(additional_params)) {
      postData = await Post.getByLimit('*', limitCondition);
      return res.status(200).json({
        message: "success",
        data: {
          total: postData.length,
          page: offset / limit + 1,
          results: postData
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
        case fieldEnum.QUERY:
          condition = `CONCAT_WS(content, title) like '%${availableFiedls[key]}%'`;
          break;
        case fieldEnum.TIME_RANGE:
          condition = `release_date BETWEEN ${availableFiedls[key]}`;
          break;
        case fieldEnum.CATEGORY:
        case fieldEnum.CONTENT_TYPE:
        case fieldEnum.PAGE_ID:
        case fieldEnum.SOURCE:
        case fieldEnum.STATUS:
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

    const finalCondition = conditions.join(" ") + ` ${limitCondition}`;
    postData = await Post.getByCondtion(finalCondition);
    res.status(200).json({
      message: "success",
      data: {
        total: postData.length,
        page: offset / limit + 1,
        results: postData
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
    const limitCondition = `LIMIT ${offset},${limit}`;

    if (_.isEmpty(additional_params)) {
      formData = await Form.getByLimit(fields, limitCondition);
      return res.status(200).json({
        message: "success",
        data: {
          total: formData.length,
          page: offset / limit + 1,
          results: formData
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

    const finalCondition = conditions.join(" ") + ` ${limitCondition}`;
    formData = await Form.getFieldsByCondition(fields, finalCondition);
    res.status(200).json({
      message: "success",
      data: {
        total: formData.length,
        page: offset / limit + 1,
        results: formData
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

  if (status !== postEnum.DRAFT && allPostCondition(additional_params)) {
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
    status
  };

  try {
    if (status !== postEnum.DRAFT && allPostCondition(additional_params)) {
      return res.status(400).json({
        success: false,
        message: `Please provide all required fields for post`,
        data: { status, additional_params },
      });
    }

    const updatedCondition = `page_id = ?, source = ?, title = ?, image = ?, release_date = ?, category = ?, content = ?, content_type = ?, status = ? WHERE id = ?`
    await Post.updateByCondition(
      updatedCondition,
      [updatedData.page_id, updatedData.source, updatedData.title,
      updatedData.image, updatedData.release_date, updatedData.category,
      updatedData.content, updatedData.content_type, updatedData.status, id]
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
  const { id, status, content } = req.body;

  if (!id || !status || !content) {
    return res.status(400).send({
      success: false,
      message: "Missing params!!!",
      data: { id, status, content }
    });
  }

  try {
    const updatedCondition = `content = ? WHERE id = ?`
    await Post.updateByCondition(
      updatedCondition,
      [content, id]
    );
    res.status(200).json({
      success: true,
      message: 'Updated ESG successfully',
      data: { id: id, status: status, content: content }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message || UPDATED_ERROR + "ESG.",
      data: { id, status, content }
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
