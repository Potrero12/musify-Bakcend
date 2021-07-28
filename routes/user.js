const express = require('express');
const UserController = require('../controllers/user');

const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/users' });

const api = express.Router();

api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/registro-usuario', UserController.saveUser);
api.post('/login-usuario', UserController.loginUser);
api.put('/actualizar-usuario/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFIle);

module.exports = api;