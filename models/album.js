const moogose = require('mongoose');
const Schema = moogose.Schema;

const AlbumSchema = Schema({
    title: String,
    description: String,
    year: String,
    image: String,
    artist: {type: Schema.ObjectId, ref: 'Artist'}
});

module.exports = moogose.model('Album', AlbumSchema);