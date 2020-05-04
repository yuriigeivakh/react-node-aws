const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

exports.createParams = (type, baseData) => ({
    Bucket: 'react-node-aws',
    Key: `category/${uuidv4()}.${type}`,
    Body: baseData,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
});

exports.uploadImage = (params, category, userId) => {
    s3.upload(params, (err, data) => {
        if (err) return { error: 'Upload to S3 failed' };
        category.image.url = data.Location;
        category.image.key = data.Key;
        // posted by
        category.postedBy = userId;

        //save to DB
        category.save((err, success) => {
            if (err) return { error: 'Saving category to DB failed' };
            return success;
        })
    })
}