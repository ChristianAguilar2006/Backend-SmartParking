import { IReservaRepository } from '../../domain/repositories/IReservaRepository';
import { Reserva } from '../../domain/entities/reserva';
import { pool } from './database/mysql.connection';
import { AVLTree } from './AVLTree';

export class MysqlReservaRepository extends IReservaRepository {
    private avl = new AVLTree();
    private hashMap = new Map<number, Reserva[]>();
    private stack: Reserva[] = [];

    private mapearFila(fila: any): Reserva {
        const reserva = new Reserva(
            fila.id_parqueadero,
            fila.id_usuario,
            new Date(fila.fecha),
            fila.hora_inicio,
            fila.hora_fin
        );
        reserva.idReserva = fila.id_reserva;
        reserva.estado = fila.estado;
        return reserva;
    }

    private indexarReserva(reserva: Reserva): void {
        this.avl.agregar(reserva);
        const existentes = this.hashMap.get(reserva.idUsuario) ?? [];
        if (!existentes.some((r) => r.idReserva === reserva.idReserva)) {
            existentes.push(reserva);
            this.hashMap.set(reserva.idUsuario, existentes);
        }
        this.stack.push(reserva);
    }

    private async cargarDesdeBD(fecha?: Date, idUsuario?: number): Promise<void> {
        if (fecha) {
            const [rows]: any = await pool.execute(
                'SELECT * FROM reservas WHERE fecha = ? AND estado != ?',
                [fecha.toISOString().slice(0, 10), 'cancelada']
            );
            rows.forEach((fila: any) => this.indexarReserva(this.mapearFila(fila)));
            return;
        }

        if (idUsuario !== undefined) {
            const [rows]: any = await pool.execute(
                'SELECT * FROM reservas WHERE id_usuario = ?',
                [idUsuario]
            );
            rows.forEach((fila: any) => this.indexarReserva(this.mapearFila(fila)));
        }
    }

    async guardar(reserva: Reserva): Promise<void> {
        const [result]: any = await pool.execute(
            'INSERT INTO reservas (id_parqueadero, id_usuario, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [reserva.idParqueadero, reserva.idUsuario, reserva.fecha, reserva.horaInicio, reserva.horaFin, reserva.estado]
        );
        reserva.idReserva = result.insertId;
        this.indexarReserva(reserva);
    }

    async buscarPorFecha(fecha: Date): Promise<Reserva[]> {
        await this.cargarDesdeBD(fecha);
        return this.avl.buscarPorFecha(fecha);
    }

    async buscarPorIdUsuario(idUsuario: number): Promise<Reserva[]> {
        if (!this.hashMap.has(idUsuario)) {
            await this.cargarDesdeBD(undefined, idUsuario);
        }
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
