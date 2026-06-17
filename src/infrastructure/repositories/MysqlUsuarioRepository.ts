import { Usuarios } from '../../domain/repositories/IUsuarioRepository';
import { pool } from './database/mysql.connection';
import { Usuario } from '../../domain/entities/usuario';
export class UsuarioMySQL extends Usuarios{
    
    async buscarPorEmail(email: string): Promise<Usuario | null> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return null;
        }

        const fila = rows[0];
        const usuario = new Usuario(fila.id_rol, fila.email, fila.nombre);
        usuario.idUsuario = fila.id_usuario;
        usuario.passwordHash = fila.password_hash;
        usuario.activo = fila.activo;

        return usuario;
    }

    async buscarPorId(id: number): Promise<Usuario | null> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const fila = rows[0];
        const usuario = new Usuario(fila.id_rol, fila.email, fila.nombre);
        usuario.idUsuario = fila.id_usuario;
        usuario.passwordHash = fila.password_hash;
        usuario.activo = fila.activo;

        return usuario;
    }

    async guardar(usuario: Usuario): Promise<void> {
        await pool.execute(
            'INSERT INTO usuarios (nombre, email, password_hash, id_rol, activo) VALUES (?, ?, ?, ?, ?)',
            [usuario.nombre, usuario.email, usuario.passwordHash, usuario.idRol, usuario.activo]
        );
    }
}