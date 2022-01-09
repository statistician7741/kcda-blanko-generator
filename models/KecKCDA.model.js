var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KecKCDASchema = new Schema({
    "_id": {
        type: String,
        required: true
    },
    "nama": {
        type: String,
        required: true
    },
    "data": {
        type: [Object],
        default: []
    },
}, { collection: 'keckcda' });

module.exports = mongoose.model('KecKCDA', KecKCDASchema);