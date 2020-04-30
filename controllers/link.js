const slugify = require('slugify');

const Link = require('../models/link');

// create, read, update, delete
exports.create = (req, res) => {
    const { title, categories, url, medium, type } = req.body;
    let link = new Link({ title, categories, url, medium, type });
    link.postedBy = req.user._id;
    link.save((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Link already exists',
            });
        }
        res.json(data);
    })
}

exports.list = (req, res) => {
    Link.find({}).exec((err, data) => {
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
    const { slug } = req.params;
    const limitValue = req.body.limit ? parseInt(limit) : 10;
    const skipValue = req.body.skip ? parseInt(skip) : 0;

    Category.findOne({slug})
        .populate('postedBy', '_id name username')
        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    error: 'Could not find category',
                });
            }
            Link
                .find({categories: category})
                .populate('postedBy', '_id name username')
                .populate('categories', 'name')
                .sort({createdAt: -1})
                .limit(limitValue)
                .skip(skipValue)
                .exec((err, links) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Could not load links of a category',
                        });
                    }
                    res.json({category, links});
                })
        })
}

exports.update = (req, res) => {
    
}

exports.remove = (req, res) => {
    
}