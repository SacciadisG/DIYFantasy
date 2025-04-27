const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'DIYFantasy',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

const DEFAULT_IMAGE = {
    url: 'https://res.cloudinary.com/dve9ihpx2/image/upload/v1745366845/DIYFantasy/zedne92zx0rjoey4etpb.jpg',
    filename: 'DIYFantasy/zedne92zx0rjoey4etpb'
}

module.exports = {
    cloudinary,
    storage,
    DEFAULT_IMAGE
}