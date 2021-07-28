const express = require('express');
const ArtistController = require('../controllers/artist');

const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/artists' });

const api = express.Router();

api.get('/pruebasAlbum', ArtistController.pruebas);
api.post('/guardar-artista', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artista/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artistas/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artista/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artista/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFIle);

module.exports = api;