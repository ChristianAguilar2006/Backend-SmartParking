import { ILogRepository } from '../../domain/repositories/ILogRepository';
import { Log } from '../../domain/entities/log';
import { pool } from './database/mysql.connection';

export class MysqlLogRepository extends ILogRepository {
    private colaFIFO: Log[] = [];
    private hashMap = new Map<number, Log[]>();

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

    async registrarSalida(idParqueadero: number, horaSalida: Date): Promise<void> {
        await pool.execute(
            'UPDATE logs SET hora_salida = ?, tipo_registro = ? WHERE id_parqueadero = ? AND hora_salida IS NULL',
            [horaSalida, 'salida', idParqueadero]
        );
        const ultimo = this.colaFIFO.shift();
        if (ultimo) {
            ultimo.horaSalida = horaSalida;
            ultimo.tipoRegistro = 'salida';
        }
    }
}