
import { Log } from '../entities/log';

export abstract class ILogRepository {
    abstract guardar(log: Log): Promise<void>;
    abstract buscarPorPlaca(placa: string): Promise<Log[]>;
    abstract buscarPorParqueadero(idParqueadero: number): Promise<Log[]>;
    abstract registrarSalida(idParqueadero: number, horaSalida: Date): Promise<number>;
}