const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//cargar rutas
const user_router = require('./routes/user');
const artist_router = require('./routes/artists');
const album_router = require('./routes/album');
const song_router = require('./routes/song');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configurar las cabeceras http

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods',  'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE'); 
    next();
   });


//rutas base
app.use('/api', user_router);
app.use('/api', artist_router);
app.use('/api', album_router);
app.use('/api', song_router);

module.exports = app;