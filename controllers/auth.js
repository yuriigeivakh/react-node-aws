const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const ses = AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
    const { name, email, password } = req.body;
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
                            <h1>Hello ${name}</h1>
                            <p>Test email</p>
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
};
