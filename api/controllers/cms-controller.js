const { uploadFile } = require('../../middlewares/utils/file-uploader-service');
const {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  GOOGLE_DRIVE_URL
} = require('../../middlewares/constant/const');
const Post = require("../models/post-model");
const Form = require("../models/form-model");

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
  const { limit, offset, additional_params } = req.body;
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

  try {
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

    const finalCondition = conditions.join(" ") + ` LIMIT ${offset},${limit}`;
    const profile = await Post.getByCondtion(finalCondition);
    res.send(profile);
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
  try {
  const { limit, offset, additional_params } = req.body;
  if(!additional_params) {
    formData = await Form.getAll();
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

    const finalCondition = conditions.join(" ") + ` LIMIT ${offset},${limit}`;
    const fields = "id, form_id, data"
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

  if (!additional_params || !status) {
    return res.status(400).send({
      success: false,
      message: "Missing params!!!",
      data: { status, additional_params }
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

    if (status !== postEnum.DRAFT) {
      if (!additional_params.page_id) {
        return res.status(400).json({
          success: false,
          message: 'Please provide page ID',
          data: { status, additional_params },
        });
      }

      const conditionWithoutPageId = !additional_params.title || !additional_params.content || !additional_params.content_type || 
                                     !additional_params.category || !additional_params.image || !additional_params.release_date || !additional_params.source;

      const conditionWithPageId = !additional_params.content || !additional_params.content_type || 
                                  !additional_params.category || !additional_params.image;

      if (additional_params.page_id === pageEnum.ESG) {
        if (conditionWithPageId) {
          return res.status(400).json({
            success: false,
            message: `Please provide all required fields for ${additional_params.page_id} page`,
            data: { status, additional_params },
          });
        }
      } else {
        if (conditionWithoutPageId) {
          return res.status(400).json({
            success: false,
            message: `Please provide all required fields for ${additional_params.page_id} page`,
            data: { status, additional_params },
          });
        }
      }
    }

    const results = await Post.create(postData);
    res.status(200).json({
      success: true,
      message: 'Created post successfully',
      data: results
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message || RETRIEVE_ERROR + "form data.",
      data: { status, additional_params }
    });
  }
};
