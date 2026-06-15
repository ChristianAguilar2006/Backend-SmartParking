// domain/use-cases/confirmarPago.ts
import { IPagoRepository } from '../repositories/IPagoRepository';

export class ConfirmarPagoUseCase {
    constructor(private pagoRepository: IPagoRepository) {}

    async ejecutar(idPago: number): Promise<void> {
        await this.pagoRepository.confirmarPago(idPago);
    }
}