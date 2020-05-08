const fs = require('fs');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const Category = require('../models/category');
const Link = require('../models/link');
const { createParams, uploadImage } = require('../helpers/imageUpload')

//s3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

exports.create = (req, res) => {
    const { name, image, content } = req.body;
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];

    const slug = slugify(name, { remove: /[*+~.()'"!:@]/g });
    let category = new Category({name, content, slug});

    const params = createParams(type, base64Data);
    
    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).json({ error: 'Upload to s3 failed' });
        }
        console.log('AWS UPLOAD RES DATA', data);
        category.image.url = data.Location;
        category.image.key = data.Key;
        // posted by
        category.postedBy = req.user._id;

        // save to db
        category.save((err, success) => {
            if (err) {
                console.log(err);
                res.status(400).json({ error: 'Duplicate category' });
            }
            return res.json(success);
        });
    });
}

exports.read = (req, res) => {
    const { slug } = req.params;

    const limit= req.body.limit ? parseInt(req.body.limit) : 10;
    const skip= req.body.skip ? parseInt(req.body.skip) : 0;

    Category
        .findOne({slug})
        .populate('postedBy', '_id, name, username')
        .exec((err, category) => {
            if (err) res.status(400).json({ error: 'Could not load category' });
            Link
                .find({categories: category})
                .populate('postedBy', '_id, name, username')
                .populate('categories', 'name')
                .sort({createdAt: -1})
                .limit(limit)
                .skip(skip)
                .exec((err, links) => {
                    if (err) res.status(400).json({ error: 'Could not load links asociated to category' });
                    return res.json({category, links});
                })
        })
}

exports.list = (_, res) => {
    Category.find({}).exec((err, data) => {
        if (err) res.status(400).json({ error: 'Category could not load' });
        res.json(data);
    })
}

exports.update = (req, res) => {
    const { slug } = req.params;
    const { name, image, content } = req.body;

    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];

    Category
        .findOneAndUpdate({slug}, {name, content}, {new: true})
        .exec((err, category) => {
            if (err) res.status(400).json({ error: 'Could not find category to update' });
            if (image) {
                const deleteParams = {
                    Bucket: 'react-node-aws',
                    Key: category.image.key,
                };

                s3.deleteObject(deleteParams, (err, data) => {
                    if (err) res.status(400).json({ error: 'S3 delete error during update' });
                });

                const params = createParams(type, base64Data);
                s3.upload(params, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ error: 'Upload to s3 failed' });
                    }
                    category.image.url = data.Location;
                    category.image.key = data.Key;
    
                    // save to db
                    category.save((err, success) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ error: 'Duplicate category' });
                        }
                        res.json(success);
                    });
                });
            } else {
                return res.json(category);
            }
        })
}

exports.remove = (req, res) => {
    const { slug } = req.params;
    Category.findOneAndRemove({slug}).exec((err, category) => {
        if (err) res.status(400).json({ error: 'Could not find category for delete' });
        const deleteParams = {
            Bucket: 'react-node-aws',
            Key: category.image.key,
        };

        s3.deleteObject(deleteParams, (err, data) => {
            if (err) res.status(400).json({ error: 'S3 delete error during update' });
        });

        res.json({message: 'Category deleted succesfully'})
    })
}
