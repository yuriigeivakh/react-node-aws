const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const expressJWT = require('express-jwt');

const User = require('../models/user');
const { registerEmailParams, forgotPasswordEmailParams } = require('../helpers/email');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({email}).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
        //generate token
        const token = jwt.sign({name, password, email}, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '10m',
        });

        const emailParams = registerEmailParams(email, token);
    
        const sendEmail = ses.sendEmail(emailParams).promise();
        sendEmail
            .then(data => {
                res.json({
                    message: `Email has been sent to ${email}. Follow the instructions to complete your registration.`
                })
                console.log(data)
            })
            .catch(err => {
                res.status(400).json({
                    message: `We could not verify your email. Please try again.`
                })
                console.log(err)
            })
    });
};

exports.registerActivate = (req, res) => {
    const { token } = req.body;
    console.log(token);
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                error: 'Expired link. Try again'
            })
        }

        const { name, password, email } = jwt.decode(token);
        const username = shortId.generate();

        User.findOne({email}).exec((err, user) => {
            if (user) {
                return res.status(401).json({
                    error: 'Email is taken',
                });
            }

            // register new user
            const newUser = new User({username, name, password, email});
            newUser.save((err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: 'Error saving user in database. Try later.',
                    });
                }
                return res.json({
                    message: 'Registration success. Please log in.'
                })
            });
        })
    })
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please register.'
            })
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password does not match'
            })
        }
        // generate token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '3d'});
        const { _id, name, email, role } = user;

        return res.json({token, user: { _id, name, email, role }});
    })
}

exports.requireSignIn = expressJWT({ secret: String(process.env.JWT_SECRET) });

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findOne({_id: authUserId}).exec((err, user) => {
        if (err ||!user) {
            return res.status(401).json({
                error: 'User not found',
            });
        }
        req.profile = user;
        next();
    });
}

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findOne({_id: adminUserId}).exec((err, user) => {
        if (err ||!user) {
            return res.status(401).json({
                error: 'User not found',
            });
        }
        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Access denied',
            });
        }

        req.profile = user;
        next();
    });
}

exports.forgotPassword = (req, res, next) => {
    const { email } = req.body;
    // check if user exists with provided email
    User.findOne({email}).exec((err, user) => {
        if (err ||!user) {
            return res.status(401).json({
                error: 'User with that email does not exist',
            });
        }
        // generate new token
        const token = jwt.sign({name: user.name}, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m', });
        // send email
        const emailParams = forgotPasswordEmailParams(email, token);
        //populate DB user 
        return user.updateOne({resetPasswordLink: token}, (err, success) => {
            if (err) {
                return res.status(400).json({
                    error: 'Password reset failed. Try later',
                });
            }
            const sendEmail = ses.sendEmail(emailParams).promise();
            sendEmail
                .then(data => {
                    console.log('ses reset password success', data)
                    return res.json({
                        message: `Email has been send to ${email}. Click the link to reset password`,
                    });
                })
                .catch(err => {
                    console.log('ses reset password failed', err)
                    return res.json({
                        error: `We could not verify your email. Try later`,
                    });
                })
        })
    })
}
