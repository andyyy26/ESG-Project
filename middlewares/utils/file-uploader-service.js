const { google } = require('googleapis');
const stream = require("stream");

const FileTypeEnum = {
    PDF: "pdf",
    DOCX: "docx",
    MP4: "mp4",
    XLSX: "xlsx",
    PPTX: "pptx",
    CSV: "csv",
    JPEG: "jpeg",
    PNG: "png",
    JPG: "jpg"
}

async function uploadFile(file) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: 'config/credential/googleapis.json',
            scopes: [process.env.SCOPE]
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const bs = new stream.PassThrough();
        bs.end(file.data);

        const fileMetaData = {
            'name': file.name,
            'parents': []
        }

        const media = {
            mimeType: "",
            body: bs
        }

        const mimeType = file.name.split(".").pop();
        switch (mimeType) {
            case FileTypeEnum.JPEG:
            case FileTypeEnum.PNG:
            case FileTypeEnum.JPG:
                fileMetaData.parents.push(process.env.IMAGE_FOLDER);
                media.mimeType = `image/${mimeType}`;
                break;
            case FileTypeEnum.DOCX:
            case FileTypeEnum.PDF:
            case FileTypeEnum.MP4:
                fileMetaData.parents.push(process.env.DOCUMENT_FOLDER);
                media.mimeType = `application/${mimeType}`;
                break;
            case FileTypeEnum.XLSX:
                fileMetaData.parents.push(process.env.DOCUMENT_FOLDER);
                media.mimeType = `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
                break;
            case FileTypeEnum.PPTX:
                fileMetaData.parents.push(process.env.DOCUMENT_FOLDER);
                media.mimeType = `application/vnd.openxmlformats-officedocument.presentationml.presentation`;
                break;
            case FileTypeEnum.CSV:
                fileMetaData.parents.push(process.env.DOCUMENT_FOLDER);
                media.mimeType = `text/csv`;
                break;
            default:
                console.error(`File type $${mimeType} is not supported!!`);
        }


        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        return response.data.id

    } catch (err) {
        console.log('Upload file error', err)
    }
}

module.exports = { uploadFile };