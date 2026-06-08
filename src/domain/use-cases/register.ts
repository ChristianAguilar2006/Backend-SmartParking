import { Usuarios } from '../repositories/IUsuarioRepository';
import { Usuario } from '../entities/usuario'
export class RegisterUseCase{

    constructor(private usuarioRepository: Usuarios) {}
    
    async registrar(nombre:string, idRol:number, email:string, contrasenia:string  ):Promise<boolean>{
        
        const nuevoUsuario = new Usuario(idRol,email,nombre);

        nuevoUsuario.validarContrasenia(contrasenia);
        nuevoUsuario.validarEmail(email);

        const existente = await this.usuarioRepository.buscarPorEmail(email);
        if (existente != null) {
            throw new Error("Ya existe un usuario con ese email");
        }

        await this.usuarioRepository.guardar(nuevoUsuario)
    

        return true;
    }

}