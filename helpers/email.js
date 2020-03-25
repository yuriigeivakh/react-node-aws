exports.registerEmailParams = (email, token) => {
    return {
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
}