"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const usuario_1 = require("../entities/usuario");
class RegisterUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async registrar(nombre, idRol, email, contrasenia) {
        const nuevoUsuario = new usuario_1.Usuario(idRol, email, nombre);
        nuevoUsuario.validarContrasenia(contrasenia);
        nuevoUsuario.validarEmail(email);
        const existente = await this.usuarioRepository.buscarPorEmail(email);
        if (existente != null) {
            throw new Error("Ya existe un usuario con ese email");
        }
        await this.usuarioRepository.guardar(nuevoUsuario);
        return true;
    }
}
exports.RegisterUseCase = RegisterUseCase;
