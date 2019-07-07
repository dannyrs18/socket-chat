var socket = io();

// Buscamos en la url si  existe el parametro nombre (enlace?nombre=Danny) si en caso de no ser asi nos redirige a index
var params = new URLSearchParams( window.location.search );
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

// Obtenermos la información del usuario
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

// Disparamos un mensaje cuando se escuche la conexión al servidor
socket.on('connect', function() {
    // Se emite un evento para que el servidor lo maneje
    socket.emit('entrarChat', usuario, (usuarios) => {
        console.log(usuarios);
    });
});

// Escuchar un evento del servidor
socket.on('crearMensaje', (usuario) => {
    console.log(usuario);
})

socket.on('listaPersonas', (data) =>{
    console.log(data);
})

// Disparamos un mensaje cuando no conecte con el servidor
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Mensajes provados de escucha
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje privado', mensaje); 
});