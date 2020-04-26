const fs = require('fs');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid')
const Category = require('../models/category');

//s3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

exports.create = (req, res, next) => {
    const { name, image, content } = req.body;
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];

    const slug = slugify(name);
    let category = new Category({name, content, slug});

    const params = {
        Bucket: 'react-node-aws',
        Key: `category/${uuidv4()}.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`,
    }
    
    s3.upload(params, (err, data) => {
        console.log('err', err)
        if (err) res.status(400).json({ error: 'Upload to S3 failed' });
        category.image.url = data.Location;
        category.image.key = data.Key;
        // posted by
        category.postedBy = req.user._id;

        //save to DB
        category.save((err, success) => {
            if (err) res.status(400).json({ error: 'Saving category to DB failed' });
            return res.json(success);
        })
    })
}

exports.read = (req, res, next) => {
    //
}

exports.list = (_, res) => {
    Category.find({}).exec((err, data) => {
        if (err) res.status(400).json({ error: 'Category could not load' });
        res.json(data);
    })
}

exports.update = (req, res, next) => {
    //
}

exports.remove = (req, res, next) => {
    //
}
