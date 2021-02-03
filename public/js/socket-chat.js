var socket = io();

var params = new URLSearchParams( window.location.search );
if( !params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp){
        console.log('Usuarios conectados', resp);
    });
    
});


// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
    socket.emit('disconnect');

});



// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(message) {
    console.log('Servidor:', message);
});

socket.on('listaPersonas', function(personas) {

    console.log( personas );

});

// Mensaje Privados
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje Privado:', mensaje);
});