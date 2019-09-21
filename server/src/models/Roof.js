const mongoose = require('mongoose');

const RoofSchema = mongoose.Schema({
    unitNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    actionCmd: {
        type: String,
        required: true
    },
    autoOnCmd: {
        type: String,
        required: true
    },
    autoOffCmd: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Roofs', RoofSchema);