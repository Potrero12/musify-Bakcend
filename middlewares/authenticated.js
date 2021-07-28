const jwt = require('jwt-simple');

const moment = require('moment');
const secret = 'clave_secreta_musify';

exports.ensureAuth = function(req, res, next){

    if(!req.headers.authorization){
        return res.status(403).send({message: 'La Petición No Tiene La Cabecera De Autentificación'});
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(404).send({message: 'El Token Ha Expirado'});
        }
    }
    catch(ex){
        return res.status(404).send({message: 'El Token No Es Valido'});
    }

    req.user = payload;

    next();

};