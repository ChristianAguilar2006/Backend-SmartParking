"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
class LoginUseCase {
    constructor(usuarioRepository, tokenmanager, historialLogins) {
        this.usuarioRepository = usuarioRepository;
        this.tokenmanager = tokenmanager;
        this.historialLogins = historialLogins;
    }
    async ejecutar(email, contrasenia) {
        const usuario = await this.usuarioRepository.buscarPorEmail(email);
        if (usuario == null) {
            throw new Error("Usuario no encontrado revise el email");
        }
        if (usuario?.passwordHash == contrasenia && usuario?.email == email) {
            console.log("Ingresado luego de " + this.historialLogins.obtenerIntentos(email).length + " intentos fallidos");
            const token = crypto.randomUUID();
            this.tokenmanager.guardar(token, usuario);
            return { token, rol: usuario.idRol, nombre: usuario.nombre, idUsuario: usuario.idUsuario };
        }
        this.historialLogins.guardarIntento(email, new Date());
        return null;
    }
}
exports.LoginUseCase = LoginUseCase;
