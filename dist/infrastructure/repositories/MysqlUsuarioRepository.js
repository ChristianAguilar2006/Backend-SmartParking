"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioMySQL = void 0;
const IUsuarioRepository_1 = require("../../domain/repositories/IUsuarioRepository");
const mysql_connection_1 = require("./database/mysql.connection");
const usuario_1 = require("../../domain/entities/usuario");
class UsuarioMySQL extends IUsuarioRepository_1.Usuarios {
    async buscarPorEmail(email) {
        const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return null;
        }
        const fila = rows[0];
        const usuario = new usuario_1.Usuario(fila.id_rol, fila.email, fila.nombre);
        usuario.idUsuario = fila.id_usuario;
        usuario.passwordHash = fila.password_hash;
        usuario.activo = fila.activo;
        return usuario;
    }
    async buscarPorId(id) {
        const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        const fila = rows[0];
        const usuario = new usuario_1.Usuario(fila.id_rol, fila.email, fila.nombre);
        usuario.idUsuario = fila.id_usuario;
        usuario.passwordHash = fila.password_hash;
        usuario.activo = fila.activo;
        return usuario;
    }
    async guardar(usuario) {
        await mysql_connection_1.pool.execute('INSERT INTO usuarios (nombre, email, password_hash, id_rol, activo) VALUES (?, ?, ?, ?, ?)', [usuario.nombre, usuario.email, usuario.passwordHash, usuario.idRol, usuario.activo]);
    }
}
exports.UsuarioMySQL = UsuarioMySQL;
