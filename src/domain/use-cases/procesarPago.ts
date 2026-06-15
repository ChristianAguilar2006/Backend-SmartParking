// domain/use-cases/procesarPago.ts
import { IPagoRepository } from '../repositories/IPagoRepository';
import { Pago } from '../entities/pago';

export class ProcesarPagoUseCase {
    constructor(private pagoRepository: IPagoRepository) {}

    async ejecutar(
        idUsuario: number,
        idParqueadero: number,
        monto: number,
        metodo: 'tarjeta' | 'transferencia' | 'billetera',
        idReserva?: number
    ): Promise<void> {
        const pago = new Pago(idUsuario, idParqueadero, monto, metodo);
        if (idReserva) pago.idReserva = idReserva;
        await this.pagoRepository.guardar(pago);
    }
}