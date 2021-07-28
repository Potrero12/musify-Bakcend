const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;

mongoose.connect ('mongodb://localhost:27017/musify', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() =>{
            console.log('la conexion a la base de datos musify se ha realizado correctamente');

            app.listen(port, () =>{
                console.log('el servidor local con node y express esta corriendo correctamente...');
            });
        })
        .catch(err => console.log(err));