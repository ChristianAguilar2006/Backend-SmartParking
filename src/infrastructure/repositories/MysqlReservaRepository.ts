import { IReservaRepository } from '../../domain/repositories/IReservaRepository';
import { Reserva } from '../../domain/entities/reserva';
import { pool } from './database/mysql.connection';
import { AVLTree } from './AVLTree';

export class MysqlReservaRepository extends IReservaRepository {
    private avl = new AVLTree();
    private hashMap = new Map<number, Reserva[]>();
    private stack: Reserva[] = [];

    async guardar(reserva: Reserva): Promise<void> {
        await pool.execute(
            'INSERT INTO reservas (id_parqueadero, id_usuario, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [reserva.idParqueadero, reserva.idUsuario, reserva.fecha, reserva.horaInicio, reserva.horaFin, reserva.estado]
        );
        this.avl.agregar(reserva);
        const existentes = this.hashMap.get(reserva.idUsuario) ?? [];
        existentes.push(reserva);
        this.hashMap.set(reserva.idUsuario, existentes);
        this.stack.push(reserva);
    }

    async buscarPorFecha(fecha: Date): Promise<Reserva[]> {
        return this.avl.buscarPorFecha(fecha);
    }

    async buscarPorIdUsuario(idUsuario: number): Promise<Reserva[]> {
        return this.hashMap.get(idUsuario) ?? [];
    }

    async cancelar(idReserva: number): Promise<void> {
        await pool.execute(
            'UPDATE reservas SET estado = ? WHERE id_reserva = ?',
            ['cancelada', idReserva]
        );
        const ultima = this.stack.pop();
        if (ultima) {
            ultima.estado = 'cancelada';
        }
    }
}