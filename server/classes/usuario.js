class Usuario {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas
    }

    getPersona(id){
        let persona = this.personas.find(elem => elem.id === id);
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonaSala(sala){
       return this.personas.filter(per => per.sala === sala)
    }

    borrarPersona(id) {
        let persona = this.getPersona(id);
        this.personas = this.personas.filter(elem => elem.id != id);
        return persona;
    }
}


module.exports = {
    Usuario
}