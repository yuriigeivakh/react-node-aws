const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const User = require('../models/user');registerEmailParams
const registerEmailParams = require('../controllers/auth');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const ses = AWS.SES({ apiVersion: '2010-12-01' });

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
                res.json({
                    error: `We could not verify your email. Please try again.`
                })
                console.log(err)
            })
    });
};
