import { Usuarios } from '../repositories/IUsuarioRepository';

export class LoginUseCase {
    constructor(private usuarioRepository: Usuarios) {}

    async ejecutar(email: string, contrasenia: string): Promise<boolean> {
        const Usuario = await this.usuarioRepository.buscarPorEmail(email);
        if (Usuario==null){
            throw new Error("Usuario no encontrado revise el email");
        }
        
        if (Usuario?.passwordHash == contrasenia && Usuario?.email == email) {
            
            return true;
        }
        return false;
    }
}