const { io } = require('../server');
const { Usuarios } = require('../classes/Usuarios');
const { crearMensaje } = require('../utilities/utilities');

var usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {
        if( !usuario.nombre || !usuario.sala){
            return callback({
                ok: false,
                message: 'El nombre/sala es necesario'
            });
        }

        client.join(usuario.sala);

        let personas = usuarios.agregarPersona( client.id, usuario.nombre, usuario.sala );

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Admin', `${usuario.nombre} entró al chat`));
        callback({
            ok: true,
            personas: usuarios.getPersonasPorSala(usuario.sala)
        });

    });

    client.on('crearMensaje', (data,callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona( client.id );
        let message = `${personaBorrada.nombre} salió de la sala`;

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} salió del chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // Mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});