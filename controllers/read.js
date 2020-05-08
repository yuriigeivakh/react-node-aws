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
