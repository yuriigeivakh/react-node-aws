const Link = require('../models/link');

exports.canUpdateDeleteLink = (req, res, next) => {
    const { id } = req.params;
    Link.findOne({_id: id})
        .exec((err, data) => {
            if (err) res.status(400).json({ error: 'Could not find link' });
            let authorizedUser = data.postedBy._id.toString() === req.user._id.toString();
            if (!authorizedUser) res.status(400).json({ error: 'You are not authorized' });
            next();
        })
}