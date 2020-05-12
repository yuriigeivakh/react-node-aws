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

exports.linkPublishedParams = (email, data) => ({
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
                        <h1>New link published | reactnodeaws.com</h1>
                        <p>A new link titled <b>${
                            data.title
                        }</b> has been just publihsed in the following categories.</p>
                        
                        ${data.categories
                            .map(category => (
                                `<div>
                                    <h2>${category.name}</h2>
                                    <img src="${category.image.url}" alt="${category.name}" style="height:50px;" />
                                    <h3><a href="${process.env.CLIENT_URL}/links/${category.slug}">Check it out!</a></h3>
                                </div>`
                            ))
                            .join('-----------------------')}

                        <br />

                        <p>Do not with to receive notifications?</p>
                        <p>Turn off notification by going to your <b>dashboard</b> > <b>update profile</b> and <b>uncheck the categories</b></p>
                        <p>${process.env.CLIENT_URL}/user/profile/update</p>

                    </html>
                `
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'New link published',
        },
    },
})