"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    constructor(idRol, email, nombre) {
        this.activo = false;
        this.idRol = idRol;
        this.email = email;
        this.nombre = nombre;
    }
    validarContrasenia(contraseña) {
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (contraseña.length < 5) {
            throw new Error("Contraseña insegura debe tener mas de 5 caracteres");
        }
        else if (!regex.test(contraseña)) {
            throw new Error("Contraseña insegura debe contener almenos un caracter especial");
        }
        this.passwordHash = contraseña;
    }
    validarEmail(email) {
        const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            throw new Error("Error mal formato de email");
        }
    }
}
exports.Usuario = Usuario;
