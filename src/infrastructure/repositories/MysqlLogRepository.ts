// infrastructure/repositories/MysqlLogRepository.ts
import { ILogRepository } from '../../domain/repositories/ILogRepository';
import { Log } from '../../domain/entities/log';
import { pool } from './database/mysql.connection';

export class MysqlLogRepository extends ILogRepository {
    private colaFIFO: Log[] = [];
    private hashMap = new Map<number, Log[]>();
    private logsPagos: Log[] = [];

    async guardar(log: Log): Promise<void> {
        await pool.execute(
            'INSERT INTO logs (id_parqueadero, id_usuario, placa, hora_entrada, tipo_registro) VALUES (?, ?, ?, ?, ?)',
            [log.idParqueadero, log.idUsuario, log.placa, log.horaEntrada, log.tipoRegistro]
        );
        this.colaFIFO.push(log);
        const existentes = this.hashMap.get(log.idParqueadero) ?? [];
        existentes.push(log);
        this.hashMap.set(log.idParqueadero, existentes);
    }

    async buscarPorPlaca(placa: string): Promise<Log[]> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM logs WHERE placa = ?',
            [placa]
        );
        return rows.map((fila: any) => {
            const log = new Log(fila.id_parqueadero, fila.id_usuario, fila.placa, fila.hora_entrada, fila.tipo_registro);
            log.idLog = fila.id_log;
            log.horaSalida = fila.hora_salida;
            return log;
        });
    }

    async buscarPorParqueadero(idParqueadero: number): Promise<Log[]> {
        return this.hashMap.get(idParqueadero) ?? [];
    }

    async registrarSalida(idParqueadero: number, horaSalida: Date): Promise<number> {
        const [rows]: any = await pool.execute(
            'SELECT hora_entrada FROM logs WHERE id_parqueadero = ? AND hora_salida IS NULL ORDER BY hora_entrada DESC LIMIT 1',
            [idParqueadero]
        );

        if (rows.length === 0) {
            throw new Error("No hay entrada activa para este parqueadero");
        }

        const horaEntrada = new Date(rows[0].hora_entrada);
        const duracionMinutos = Math.floor((horaSalida.getTime() - horaEntrada.getTime()) / 60000);

        await pool.execute(
            'UPDATE logs SET hora_salida = ?, tipo_registro = ?, duracion_minutos = ? WHERE id_parqueadero = ? AND hora_salida IS NULL',
            [horaSalida, 'salida', duracionMinutos, idParqueadero]
        );

        const ultimo = this.colaFIFO.shift();
        if (ultimo) {
            ultimo.horaSalida = horaSalida;
            ultimo.tipoRegistro = 'salida';
        }

        return duracionMinutos;
    }

    obtenerColaEventos(): Log[] {
        return [...this.colaFIFO];
    }
}