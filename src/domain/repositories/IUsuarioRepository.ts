import { Usuario } from '../entities/usuario';

export abstract class Usuarios {
    abstract buscarPorEmail(email: string): Promise<Usuario | null>;
    abstract guardar(usuario: Usuario): Promise<void>;
    abstract buscarPorId(id: string): Promise<Usuario | null>;
}