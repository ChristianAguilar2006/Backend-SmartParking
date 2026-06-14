// domain/use-cases/cambiarEstado.ts
import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';

export class CambiarEstadoUseCase {
    constructor(private parqueaderoRepository: IParqueaderoRepository) {}

    async ejecutar(
        idParqueadero: number,
        estado: 'libre' | 'ocupado' | 'reservado' | 'mantenimiento' | 'bloqueado'
    ): Promise<void> {
        await this.parqueaderoRepository.cambiarEstado(idParqueadero, estado);
    }
}