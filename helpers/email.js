exports.registerEmailParams = (email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
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
}

exports.forgotPasswordEmailParams = (email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                        <html>
                            <body>
                            <h1>Reset password link</h1>
                            <p>Please use following link to reset your password:</p>
                            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                            </body>
                        </html>`,
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Reset your password',
            },
        },
    };
}