const { io } = require('../server');
const { Usuario } = require('../classes/usuario');
const { crearMensaje } = require('../utils/utils');

let usuario = new Usuario();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        if(!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }
        
        // Vamos a ingresar al cliente en una sala
        client.join(data.sala);

        usuario.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas', usuario.getPersonaSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio al chat`));
        callback(usuario.getPersonaSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.sala).emit('crearMensaje', mensaje);
        callback(mensaje, true);
    })

    // Mensaje privado de escucha (el front-end envia la patecion y el backend la controla enviando el mensaje a un usuario privado)
    client.on('mensajePrivado', data => {
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(data.nombre, data.mensaje))
    })

    client.on('disconnect', () => {
        let personaBorrada = usuario.borrarPersona(client.id);
        if (!personaBorrada) return
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuario.getPersonaSala(personaBorrada.sala));
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
    })
});