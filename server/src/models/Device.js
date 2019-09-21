const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    unitNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
    }
});

module.exports = mongoose.model('Devices', DeviceSchema);