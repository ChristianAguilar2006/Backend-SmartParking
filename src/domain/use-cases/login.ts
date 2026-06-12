import { Usuarios } from '../repositories/IUsuarioRepository';
import { SesionRepository } from '../repositories/ISessionManager';
import { LoginHistory } from '../repositories/IFallosLogin';

export class LoginUseCase {
    constructor(
        private usuarioRepository: Usuarios,
        private tokenmanager: SesionRepository,
        private historialLogins: LoginHistory
    ) {}

    async ejecutar(email: string, contrasenia: string): Promise<string | null> {
        const usuario = await this.usuarioRepository.buscarPorEmail(email);

        if (usuario == null) {
            throw new Error("Usuario no encontrado revise el email");
        }

        if (usuario?.passwordHash == contrasenia && usuario?.email == email) {
            console.log("Ingresado luego de " + this.historialLogins.obtenerIntentos(email).length + " intentos fallidos");

            const token = crypto.randomUUID();
            this.tokenmanager.guardar(token, usuario);
            return token;
        }

        this.historialLogins.guardarIntento(email, new Date());
        return null;
    }
}