const pageEnum = {
    LIB: "LIB",
    ACTIVITIES: "ATV",
    ESG: "ESG"
}

const postColumnEnum = {
    CATEGORY: "category",
    CONTENT: "content",
    CONTENT_TYPE: "content_type",
    IMAGE: "image",
    PAGE_ID: "page_id",
    RELEASE_DATE: "release_date",
    SOURCE: "source",
    STATUS: "status",
    TITLE: "title"
}

const inputFieldEnum = {
    QUERY: "query",
    SOURCE: "source",
    CATEGORY: "category",
    CONTENT_TYPE: "content_type",
    TIME_RANGE: "time_range",
    PAGE_ID: "page_id",
    STATUS: "status"
}

const statusEnum = {
    PUBLISH: "PUBLISH",
    DRAFT: "DRAFT"
}

const userEnum = {
    ADMIN: "Admin",
    USER: "User"
}

const webEnum = {
    WEB: "WEB",
    CMS: "CMS"
}

const tokenEnum = {
    VALID: "Valid",
    INVALID: "Invalid"
}

const categoryEnum = {
    LIBRARY: "LIBRARY",
    EVENT: "EVENT",
    NEWS: "NEWS"
}

module.exports = {
    pageEnum,
    postColumnEnum,
    inputFieldEnum,
    statusEnum,
    userEnum,
    webEnum,
    tokenEnum,
    categoryEnum
};