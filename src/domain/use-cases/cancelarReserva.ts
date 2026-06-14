import { IReservaRepository } from '../repositories/IReservaRepository';

export class CancelarReservaUseCase {
    constructor(private reservaRepository: IReservaRepository) {}

    async ejecutar(idReserva: number): Promise<void> {
        await this.reservaRepository.cancelar(idReserva);
    }
}