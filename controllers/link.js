const AWS = require('aws-sdk');

const Link = require('../models/link');
const User = require('../models/user');
const Category = require('../models/category');
const { linkPublishedParams } = require('../helpers/email');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// create, read, update, delete
exports.create = (req, res) => {
    const { title, categories, url, medium, type } = req.body;
    const slug = url;
    let link = new Link({ title, url, categories, type, medium, slug });
    // posted by user
    link.postedBy = req.user._id;
    link.save((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Link already exists',
            });
        }
        res.json(data);
        User.find({categories: {$in: categories}}).exec((err, users) => {
            if (err) throw new Error(err);
            Category.find({_id: {$in: categories}}).exec((err, result) => {
                data.categories = result;
                users.forEach((element) => {
                    const params = linkPublishedParams(element.email, data);
                    const sendEmail = ses.sendEmail(params).promise();
                    sendEmail
                        .then(success => {
                            console.log('Email send successfully', success)
                            return 
                        })
                        .catch(err => console.log(err))
                });
            });
        });
    });
}

exports.list = (req, res) => {
    const limit= req.body.limit ? parseInt(req.body.limit) : 10;
    const skip= req.body.skip ? parseInt(req.body.skip) : 0;

    Link.find({})
        .populate('postedBy', 'name')
        .populate('categories', 'name slug')
        .limit(limit)
        .skip(skip)
        .exec((err, data) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: 'Could not list links',
                });
            }
            res.json(data);
        })
}

exports.read = (req, res) => {
    const { id } = req.params;

    Link.findOne({_id: id})
        .exec((err, link) => {
            if (err) {
                return res.status(400).json({
                    error: 'Could not find Link',
                });
            }
            res.json(link);
        })
}

exports.update = (req, res) => {
    const { id } = req.params;
    const { title, url, categories, type, medium } = req.body;
    Link.findOneAndUpdate({_id: id}, { title, url, categories, type, medium }, {new: true})
        .exec((err, updated) => {
            if (err) res.status(400).json({ error: 'Could not find link for delete' });
            res.json(updated);
        })
}

exports.remove = (req, res) => {
    const { id } = req.params;
    Link.findOneAndRemove({_id: id}).exec((err) => {
        if (err) res.status(400).json({ error: 'Could not find link for delete' });
        res.json({message: 'Link deleted succesfully'})
    })
}

exports.clickCount = (req, res) => {
    const { linkId } = req.body;
    Link.findOneAndUpdate({_id: linkId}, { $inc: { clicks: 1 } }, { upsert: true, new: true }).exec((err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Could not update view count',
            });
        }
        res.json(result);
    });
}

exports.popular = (req, res) => {
    Link
        .find()
        .populate('postedBy', 'name')
        .sort({clicks: -1})
        .limit(3)
        .exec((err, links) => {
            if (err) return res.status(400).json({error: 'Could not update view count'});
            res.json(links);
        });
}

exports.popularInCategory = (req, res) => {
    const { slug } = req.params;

    Category
        .findOne({slug})
        .exec((err, category) => {
            if (err) return res.status(400).json({error: 'Could not load category'});
            Link
                .find({categories: category})
                .populate('postedBy', 'name')
                .sort({clicks: -1})
                .limit(3)
                .exec((err, links) => {
                    if (err) return res.status(400).json({error: 'Could not update view count'});
                    res.json(links);
                });
        });
}
    