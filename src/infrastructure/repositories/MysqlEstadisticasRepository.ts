
import { IEstadisticasRepository } from '../../domain/repositories/IEstadisticasRepository';
import { pool } from './database/mysql.connection';
import { AVLEstadisticas } from './AVLEstadisticas';
import { Log } from '../../domain/entities/log';

export class MysqlEstadisticasRepository extends IEstadisticasRepository {
    private avl = new AVLEstadisticas();
    private hashMap = new Map<string, number>();
    private seriesTiempo: { fecha: Date, cantidad: number }[] = [];

    async ocupacionPromedio(): Promise<number> {
        const [rows]: any = await pool.execute(
            'SELECT AVG(duracion_minutos) as promedio FROM logs WHERE hora_salida IS NOT NULL'
        );
        return rows[0].promedio ?? 0;
    }

    async horasPico(): Promise<{ hora: number, cantidad: number }[]> {
        const [rows]: any = await pool.execute(
            'SELECT HOUR(hora_entrada) as hora, COUNT(*) as cantidad FROM logs GROUP BY HOUR(hora_entrada) ORDER BY cantidad DESC'
        );
        rows.forEach((fila: any) => {
            this.hashMap.set(`hora_${fila.hora}`, fila.cantidad);
            this.seriesTiempo.push({ fecha: new Date(), cantidad: fila.cantidad });
        });
        return rows.map((fila: any) => ({ hora: fila.hora, cantidad: fila.cantidad }));
    }

    async tiempoPromedioEstadia(): Promise<number> {
        const [rows]: any = await pool.execute(
            'SELECT AVG(duracion_minutos) as promedio FROM logs WHERE duracion_minutos IS NOT NULL'
        );
        return rows[0].promedio ?? 0;
    }

    async parqueaderosMasReservados(): Promise<{ idParqueadero: number, cantidad: number }[]> {
        const [rows]: any = await pool.execute(
            'SELECT id_parqueadero, COUNT(*) as cantidad FROM reservas GROUP BY id_parqueadero ORDER BY cantidad DESC'
        );
        rows.forEach((fila: any) => {
            this.hashMap.set(`parqueadero_${fila.id_parqueadero}`, fila.cantidad);
        });
        return rows.map((fila: any) => ({ idParqueadero: fila.id_parqueadero, cantidad: fila.cantidad }));
    }

    async reservasPorUsuario(idUsuario: number): Promise<number> {
        const [rows]: any = await pool.execute(
            'SELECT COUNT(*) as cantidad FROM reservas WHERE id_usuario = ?',
            [idUsuario]
        );
        return rows[0].cantidad ?? 0;
    }

    async ingresosTotales(): Promise<number> {
        const [rows]: any = await pool.execute(
            'SELECT SUM(monto) as total FROM pagos WHERE estado = ?',
            ['confirmado']
        );
        return rows[0].total ?? 0;
    }

    async metodoPagoMasUsado(): Promise<string> {
        const [rows]: any = await pool.execute(
            'SELECT metodo, COUNT(*) as cantidad FROM pagos GROUP BY metodo ORDER BY cantidad DESC LIMIT 1'
        );
        const metodo = rows[0]?.metodo ?? 'ninguno';
        this.hashMap.set('metodo_mas_usado', 1);
        return metodo;
    }

    async buscarPorRango(inicio: Date, fin: Date): Promise<Log[]> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM logs WHERE hora_entrada BETWEEN ? AND ?',
            [inicio, fin]
        );
        rows.forEach((fila: any) => {
            const log = new Log(fila.id_parqueadero, fila.id_usuario, fila.placa, fila.hora_entrada, fila.tipo_registro);
            this.avl.agregar(log);
        });
        return this.avl.buscarPorRango(inicio, fin);
    }

    obtenerSeriesTiempo(): { fecha: Date, cantidad: number }[] {
        return this.seriesTiempo;
    }
}