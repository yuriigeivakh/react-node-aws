const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
            })
        }
        //generate token
        const token = jwt.sign({name, password, email}, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '10m',
        })

        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAdresses: email,
            },
            ReplyToAdresses: [process.env.EMAIL_TO],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `
                            <html>
                                <body>
                                <h1>Verify your email adress</h1>
                                <p>Please use following link to complete your registration:</p>
                                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                                </body>
                            </html>`,
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Complete your registration',
                },
            },
        };
    
        const sendEmail = ses.sendEmail(params).promise();
        sendEmail
            .then(data => {
                res.send('Email sent')
                console.log(data)
            })
            .catch(err => {
                res.send('Email failed')
                console.log(err)
            })
    });
};
