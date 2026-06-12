import { SesionRepository } from '../../domain/repositories/ISessionManager';
import { Usuario } from '../../domain/entities/usuario'

export class TokenManager extends SesionRepository{
    currentSesions = new Map<string, Usuario>();

    guardar(token: string, usuario: Usuario){
        this.currentSesions.set(token, usuario);
    }
    
    buscarPorToken(token: string): Usuario | null{
        
        const user = this.currentSesions.get(token);
        return user ?? null;
    }

}
    