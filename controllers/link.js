const slugify = require('slugify');

const Link = require('../models/link');

// create, read, update, delete
exports.create = (req, res) => {
    const { title, categories, url, medium, type } = req.body;
    let link = new Link({ title, categories, url, medium, type });
    link.postedBy = req.user._id;
    let categoriesLists = categories && categories.split(',');
    link.categories = categoriesLists;
    console.log(link)
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
    
}

exports.update = (req, res) => {
    
}

exports.remove = (req, res) => {
    
}