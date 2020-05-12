const User = require('../models/user');
const Link = require('../models/link');

exports.read = (req, res) => {
    User.findOne({_id: req.user._id}).exec((err, user) => {
        if (err) return res.status(404).json({error: 'Could not find user'});
        Link
            .find({postedBy: user})
            .populate('categories', 'name slug')
            .populate('postedBy', 'name')
            .sort({createdAt: -1})
            .exec((err, links) => {
                if (err) res.status(400).json({ error: 'Could not load links posted by user' });
                user.hashed_password = undefined;
                user.salt = undefined;
                res.json({user, links});
            })
    })
}

exports.update = (req, res, next) => {
    const { name, password, categories } = req.body;

    if (password && password.length < 6) res.status(400).json({ error: 'Password must be at least 6 characters long' });

    User
        .findOneAndUpdate({_id: req.user._id}, {name, password, categories}, {new: true})
        .exec((err, user) => {
            if (err) res.status(400).json({ error: 'Could not find user to update' });
            user.hashes_password = undefined;
            user.salt = undefined;

            res.json(user);
        });
}