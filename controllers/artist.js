const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');
const pagination = require('mongoose-pagination');

function pruebas(req, res){
    res.status(200).send({message: 'Pruebas de artistos'})
}

function saveArtist(req, res){

    const artist = new Artist();

    const params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;

    
    if(params.name == null  || params.name == '' || params.description == null || params.description == ''){
        res.status(404).send({message: 'Datos incorrectos, revisalos'});

    } else {    
        artist.save((err, artistStored) => {
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            } else {
                if(!artistStored){
                    res.status(404).send({message: 'No se puedo guardar el artista'});
                } else {
                    res.status(200).send({artist: artistStored});
                }
            }
        });
    }

};

function getArtist(req ,res){
    const artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!artist){
                res.status(404).send({message: 'No se encontro ningun artista'});
            } else {
                res.status(200).send({artist});
            }
        }
    })
};

function getArtists(req, res){

    if(req.params.page){
        var page = req.params.page;
    } else {
        var page = 1;
    }
    const itemsPerPage = 4;

    Artist.find().sort('name').paginate(page, itemsPerPage,(err, artists, total) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!artists){
                res.status(404).send({message: 'No se encontraron artistas'});
            } else {
                res.status(200).send({
                    pages: total,
                    artists
                });
            }
        }
    })

};

function updateArtist(req, res){
    const artistId = req.params.id;

    const update = req.body;

    Artist.findByIdAndUpdate(artistId, update, {new: true}, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!artistUpdated){
                res.status(404).send({message: 'No hay artista para actualizar'});
            } else {
                res.status(200).send({artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res){

    const artistId = req.params.id;

    Artist.findByIdAndDelete(artistId, (err, artistDeleted) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!artistDeleted) {
                res.status(404).send({message: 'No hay artista para Borrar'});
            } else {
                Album.find({artist: artistDeleted._id}).deleteMany((err, albumRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Error Al Eliminar El Album'});
                    } else {
                        if(!albumRemoved){
                            res.status(404).send({message: 'El Album no ha sido eliminado'});
                        } else {
                            Song.find({album : albumRemoved._id}).deleteMany((err, songRemoved) => {
                                if(err){
                                    res.status(500).send({message: 'Error Al eliminar La Cancion'});
                                } else {
                                    if(!songRemoved){
                                        res.status(404).send({message: 'No hay Cancion para eliminar'});
                                    } else {
                                        res.status(200).send({artist: artistDeleted});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){

    const artistId = req.params.id;
    const file_name = 'No Subido...';

    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];

        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){

            Artist.findByIdAndUpdate(artistId,{image: file_name}, (err, artistUpdated) => {
                if(!artistUpdated){
                    res.status(404).status({message: 'No se Pudo Actualizar el usuario'});
                } else {
                    res.status(200).send({artist: artistUpdated});
                }
            });

        } else {
            res.status(200).send({message: 'Extension De Archivo No Valida'});
        }
    } else {
        res.status(200).send({message: 'No Has Subido Ninguna Imagen...'});
    }

};

function getImageFIle(req, res){

    const imageFile = req.params.imageFile;
    const path_file = './uploads/artists/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No Existe la imagen'});
        }
    });

}

module.exports = {
    pruebas,
    saveArtist,
    getArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFIle
}