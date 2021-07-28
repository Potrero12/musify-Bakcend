const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');
const pagination = require('mongoose-pagination');

function pruebas(req, res){
    res.status(200).send({message: 'Pruebas de Cancion'})
}

function saveSong(req, res){

    const song = new Song();

    const params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!songStored){
                res.status(404).send({message: 'No se encontro ninguna Canción para guardar'});
            } else {
                res.status(200).send({song: songStored});
            }
        }
    })
};

function getSong(req, res){
    const songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!song){
                res.status(404).send({message: 'No se encontro ninguna Canción'});
            } else {
                res.status(200).send({song});
            }
        }
    })
};

function getSongs(req, res){

    const albumId = req.params.id;

    let album;

    if(!albumId){
        album = Song.find({}).sort('number');
    } else {
        album = Song.find({album: albumId}).sort('number');
    }

    album.populate({path: 'album', populate: {path: 'artist', model: 'Artist'}}).exec((err, songs) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!songs){
                res.status(404).send({message: 'No se encontraron canciones'});
            } else {
                res.status(200).send({songs});
            }
        }
    })
};

function updateSong(req, res){
    const songId = req.params.id;

    const update = req.body;

    Song.findByIdAndUpdate(songId, update, {new: true}, (err, songUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!songUpdated){
                res.status(404).send({message: 'No hay cancion para actualizar'});
            } else {
                res.status(200).send({song: songUpdated}); 
            }
        }
    })
};

function deleteSong(req, res){
    const songId = req.params.id;

    Song.findByIdAndDelete(songId, (err, songRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!songRemoved){
                res.status(404).send({message: 'No hay cancion para eliminar'}); 
            } else {
                res.status(200).send({songRemoved}); 
            }
        }
    })
};

function uploadFile(req, res){

    const songId = req.params.id;
    const file_name = 'No Subido...';

    if(req.files){
        const file_path = req.files.file.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];

        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg' || file_ext == '3pg' || file_ext == 'mp4'){

            Song.findByIdAndUpdate(songId,{file: file_name}, (err, songUpdated) => {
                if(!songUpdated){
                    res.status(404).status({message: 'No se Pudo subir el audio'});
                } else {
                    res.status(200).send({song: songUpdated});
                }
            });

        } else {
            res.status(200).send({message: 'Extension De Archivo No Valida'});
        }
    } else {
        res.status(200).send({message: 'No Has Subido Ninguna Cancion...'});
    }

};

function getSongFile(req, res){

    const imageFile = req.params.songFile;
    const path_file = './uploads/songs/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No Existe la cancion...'});
        }
    });

}

module.exports = {
    pruebas,
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}