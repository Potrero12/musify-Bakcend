const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

function pruebas(req, res){
    res.status(200).send({message: 'Prueba controlador'});
}

function saveUser(req, res){

    const user = new User();
    const params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    if(params.password){
        //encriptar la contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                //guardar el usuario
                user.save((err, userStored) => {
                    if(err) {
                        res.status(500).send({message: 'Error en el servidor'});
                    } else {
                        if(!userStored){
                            res.status(404).send('No se ha guardado el Usuario, revisa tus datos');
                        } else {
                            res.status(200).send({user: userStored});
                        }
                    }
                })
            }else {
                res.status(500).send({message: 'Introduce Todos Los Datos'});
            }
        });
    }
     else {
        res.status(500).send({message: 'Introduce la Contraseña'});
    }

}

function loginUser(req, res){

    const params = req.body;

    const email = params.email;
    const password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error En La Peticíon'});
        } else {
            if(!user){
                res.status(404).send({message: 'El usuario No Existe'});
            } else {
                //Comprobar la contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        //devolver los datos del usuario logeado
                        if(params.gethash){
                            // devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: 'El usuario No Ha Podido Loguearse'});
                    }
                });
            }
        }
    });

}

function updateUser(req, res){

    const userId = req.params.id;

    const update = req.body;

    if(userId != req.user.sub){
        return res.status(500).status({message: 'No Tienes Permiso Para Actualizar Este Usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if(err){
            res.status(500).status({message: 'Error en el servidor'})
        } else {
            if(!userUpdated){
                res.status(404).status({message: 'No se Pudo Actualizar el usuario'});
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){

    const userId = req.params.id;
    const file_name = 'No Subido...';

    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];

        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){

            User.findByIdAndUpdate(userId,{image: file_name}, (err, userUpdated) => {
                if(!userUpdated){
                    res.status(404).status({message: 'No se Pudo Actualizar el usuario'});
                } else {
                    res.status(200).send({image: file_name, user: userUpdated});
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
    const path_file = './uploads/users/'+imageFile;

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
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFIle
}