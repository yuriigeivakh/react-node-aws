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
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }
        console.table({err, fields, files});
        const { name, content } = fields;
        const { image } = files;
        const slug = slugify(name);
        let category = new Category({name, content, slug});

        if (image.size > 2000000) res.status(400).json({ error: 'Image could not upload more than 2MB' });
        // upload image to s3
        const params = {
            Bucket: 'react-node-aws',
            Key: `category/${uuidv4()}`,
            Body: fs.readFileSync(image.path),
            ACL: 'public-read',
            ContentType: 'image/jpg',
        }

        s3.upload(params, (err, data) => {
            console.log(err)
            if (err) res.status(400).json({ error: 'Upload to S3 failed' });
            category.image.url = data.Location;
            category.image.key = data.Key;

            //save to DB
            category.save((err, success) => {
                if (err) res.status(400).json({ error: 'Saving category to DB failed' });
                return res.json(success);
            })
        })
    })
}

exports.read = (req, res, next) => {
    //
}

exports.list = (req, res, next) => {
    //
}

exports.update = (req, res, next) => {
    //
}

exports.remove = (req, res, next) => {
    //
}
