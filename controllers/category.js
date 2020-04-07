const slugify = require('slugify');
const Category = require('../models/category');

exports.create = (req, res, next) => {
    const { name, content } = req.body;
    const slug = slugify(name);
    const imageUrl = {
        url: 'https://via.placeholder.com/350x150?text=react-node-aws',
        key: '123',
    }

    const category = new Category({ name, slug, imageUrl });
    category.postedBy = req.user._id;
    category.save((err, data) => {
        if (err) {
            console.log('Category create error', err);
            return res.status(400).json({
                error: 'Category create failed'
            })
        }
        res.json(data);
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
