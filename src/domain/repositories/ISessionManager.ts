import { Usuario } from '../entities/usuario';

export abstract class SesionRepository {
    abstract guardar(token: string, usuario: Usuario): void;
    abstract buscarPorToken(token: string): Usuario | null;
}