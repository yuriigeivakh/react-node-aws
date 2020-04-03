const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');

const User = require('../models/user');
const { registerEmailParams } = require('../helpers/email');

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
