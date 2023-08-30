const { google } = require('googleapis');
const stream = require("stream");

const FileTypeEnum = {
    PDF: "pdf",
    DOCX: "docx",
    MP4: "mp4",
    JPEG: "jpeg",
    PNG: "png",
    JPG: "jpg"
}

async function uploadFile(file) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: '/etc/secrets/googleapis.json',
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
                media.mimeType = `file/${mimeType}`;
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