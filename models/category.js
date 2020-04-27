const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32,
        },
        slug: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            index: true,
        },
        image: {
            url: String,
            key: String,
        },
        content: {
            type: {},
            min: 20,
            min: 2000,
        },
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
);


module.exports = mongoose.model('Category', categorySchema);
