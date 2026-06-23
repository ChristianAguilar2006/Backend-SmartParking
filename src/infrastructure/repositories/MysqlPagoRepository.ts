import { IPagoRepository } from '../../domain/repositories/IPagoRepository';
import { Pago } from '../../domain/entities/pago';
import { pool } from './database/mysql.connection';

export class MysqlPagoRepository extends IPagoRepository {
    private colaFIFO: Pago[] = [];
    private hashMap = new Map<number, Pago>();
    private logsPagos: Pago[] = [];

    private mapearFila(fila: any): Pago {
        const pago = new Pago(fila.id_usuario, fila.id_parqueadero, fila.monto, fila.metodo);
        pago.idPago = fila.id_pago;
        pago.idReserva = fila.id_reserva;
        pago.estado = fila.estado;
        return pago;
    }

    private indexarPago(pago: Pago): void {
        if (pago.idPago) this.hashMap.set(pago.idPago, pago);
        if (pago.estado === 'pendiente') this.colaFIFO.push(pago);
        this.logsPagos.push(pago);
    }

    async guardar(pago: Pago): Promise<void> {
        const [result]: any = await pool.execute(
            'INSERT INTO pagos (id_usuario, id_reserva, id_parqueadero, monto, metodo, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [pago.idUsuario, pago.idReserva ?? null, pago.idParqueadero, pago.monto, pago.metodo, pago.estado]
        );
        pago.idPago = result.insertId;
        this.indexarPago(pago);
    }

    async buscarPorUsuario(idUsuario: number): Promise<Pago[]> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM pagos WHERE id_usuario = ?',
            [idUsuario]
        );
        return rows.map((fila: any) => {
            const pago = this.mapearFila(fila);
            if (pago.idPago) this.hashMap.set(pago.idPago, pago);
            return pago;
        });
    }

    async confirmarPago(idPago: number): Promise<void> {
        await pool.execute(
            'UPDATE pagos SET estado = ? WHERE id_pago = ?',
            ['confirmado', idPago]
        );
        const pago = this.hashMap.get(idPago);
        if (pago) {
            pago.estado = 'confirmado';
            this.hashMap.set(idPago, pago);
        }
        this.colaFIFO.shift();
    }

    async rechazarPago(idPago: number): Promise<void> {
        await pool.execute(
            'UPDATE pagos SET estado = ? WHERE id_pago = ?',
            ['fallido', idPago]
        );
        const pago = this.hashMap.get(idPago);
        if (pago) {
            pago.estado = 'fallido';
            this.hashMap.set(idPago, pago);
        }
        this.colaFIFO.shift();
    }

    obtenerLogs(): Pago[] {
        return this.logsPagos;
    }

    obtenerColaPendiente(): Pago[] {
        return [...this.colaFIFO];
    }

    async cargarColaDesdeBD(): Promise<Pago[]> {
        if (this.colaFIFO.length > 0) return this.obtenerColaPendiente();
        const [rows]: any = await pool.execute(
            "SELECT * FROM pagos WHERE estado = 'pendiente' ORDER BY id_pago ASC"
        );
        rows.forEach((fila: any) => {
            const pago = this.mapearFila(fila);
            if (pago.idPago) this.hashMap.set(pago.idPago, pago);
            this.colaFIFO.push(pago);
        });
        return this.obtenerColaPendiente();
    }
}
