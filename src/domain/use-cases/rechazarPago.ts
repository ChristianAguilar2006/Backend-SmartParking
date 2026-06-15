// domain/use-cases/rechazarPago.ts
import { IPagoRepository } from '../repositories/IPagoRepository';

export class RechazarPagoUseCase {
    constructor(private pagoRepository: IPagoRepository) {}

    async ejecutar(idPago: number): Promise<void> {
        await this.pagoRepository.rechazarPago(idPago);
    }
}