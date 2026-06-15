// domain/use-cases/registrarEntrada.ts
import { ILogRepository } from '../repositories/ILogRepository';
import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';
import { Log } from '../entities/log';

export class RegistrarEntradaUseCase {
    constructor(
        private logRepository: ILogRepository,
        private parqueaderoRepository: IParqueaderoRepository
    ) {}

    async ejecutar(idParqueadero: number, idUsuario: number, placa: string): Promise<void> {
        const parqueadero = await this.parqueaderoRepository.buscarPorId(idParqueadero);

        if (!parqueadero) {
            throw new Error("Parqueadero no encontrado");
        }

        if (!parqueadero.estaDisponible()) {
            throw new Error("El parqueadero no está disponible");
        }

        const log = new Log(idParqueadero, idUsuario, placa, new Date(), 'entrada');
        await this.logRepository.guardar(log);
        await this.parqueaderoRepository.cambiarEstado(idParqueadero, 'ocupado');
    }
}