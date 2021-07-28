const moongose = require('mongoose');
const Schema = moongose.Schema;

const SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: { type: Schema.ObjectId, ref: 'Album' }
});

module.exports = moongose.model('Song', SongSchema);