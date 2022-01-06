var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DesKelKCDASchema = new Schema({
    "_id": {
        type: String,
        required: true
    },
    "nama": {
        type: String,
        required: true
    },
    "kecId": {
        type: String,
        required: true
    },
    "data": {
        type: [Object],
        default: []
    },
}, { collection: 'deskelkcda' });

module.exports = mongoose.model('DesKelKCDA', DesKelKCDASchema);