const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');
const pagination = require('mongoose-pagination');

function pruebas(req, res){
    res.status(200).send({message: 'Pruebas de Album'})
}

function saveAlbum(req, res){
    const album = new Album();

    const params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    // if(params.title == null  || params.title == '' || params.description == null || params.description == '' || params.year == null || params.year == '' || params.artist == null || params.artist == ''){
    //     res.status(404).send({message: 'Datos incorrectos, revisalos'});

    // } else {
        //guardamos el album
        album.save((err, albumStored) =>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            } else {
                if(!albumStored){
                    res.status(404).send({message: 'No se encontro ningun Album para guardar'});
                } else {
                    res.status(200).send({album: albumStored});
                }
            }
        })
    //}
}

function getAlbum(req, res){
    const albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!album){
                res.status(404).send({message: 'No se encontro ningun Album'});
            } else {
                res.status(200).send({album});
            }
        }
    })
}

function getAlbums(req, res){
    const artistId = req.params.id;

    let artist;

    if(!artistId){
        artist = Album.find({}).sort('title');
    } else {
        artist = Album.find({artist: artistId}).sort('year');
    }

    artist.populate({path: 'artist'}).exec((err, albums) => {
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            } else {
                if(!albums){
                    res.status(404).send({message: 'No se encontraron albumes'});
                } else {
                    res.status(200).send({albums});
                }
            }
        })
}

function updateAlbum(req, res){
    const albumId = req.params.id;

    const update = req.body;

    Album.findByIdAndUpdate(albumId, update, {new: true}, (err, albumUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!albumUpdated){
                res.status(404).send({message: 'No se actualizo el album'});
            } else {
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res){
    const albumId = req.params.id;

    Album.findByIdAndDelete(albumId).deleteMany((err, albumRemoved) => {
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
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){

    const albumId = req.params.id;
    const file_name = 'No Subido...';

    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];

        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){

            Album.findByIdAndUpdate(albumId,{image: file_name}, (err, albumUpdated) => {
                if(!albumUpdated){
                    res.status(404).status({message: 'No se Pudo Actualizar el usuario'});
                } else {
                    res.status(200).send({album: albumUpdated});
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
    const path_file = './uploads/albums/'+imageFile;

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
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFIle
}