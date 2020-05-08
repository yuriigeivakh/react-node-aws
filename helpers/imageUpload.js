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
