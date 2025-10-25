const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
    {
        shop: {
            type: String,
            unique: true,
            required: true,
        },
        accessToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Auth', authSchema);
