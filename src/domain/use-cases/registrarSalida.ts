// domain/use-cases/registrarSalida.ts
import { ILogRepository } from '../repositories/ILogRepository';
import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';

export class RegistrarSalidaUseCase {
    constructor(
        private logRepository: ILogRepository,
        private parqueaderoRepository: IParqueaderoRepository
    ) {}

    async ejecutar(idParqueadero: number): Promise<void> {
        const parqueadero = await this.parqueaderoRepository.buscarPorId(idParqueadero);

        if (!parqueadero) {
            throw new Error("Parqueadero no encontrado");
        }

        await this.logRepository.registrarSalida(idParqueadero, new Date());
        await this.parqueaderoRepository.cambiarEstado(idParqueadero, 'libre');
    }
}