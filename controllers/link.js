const slugify = require('slugify');

const Link = require('../models/link');

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
    Link.findOneAndRemove({id}).exec((err, category) => {
        if (err) res.status(400).json({ error: 'Could not find link for delete' });
        res.json({message: 'Link deleted succesfully'})
    })
}

exports.clickCount = (req, res) => {
    const { linkId } = req.body;
    Link.findOneAndUpdate(linkId, { $inc: { clicks: 1 } }, { upsert: true, new: true }).exec((err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Could not update view count',
            });
        }
        res.json(result);
    });
}