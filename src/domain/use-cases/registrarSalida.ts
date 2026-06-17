import { ILogRepository } from '../repositories/ILogRepository';
import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';
import { IPagoRepository } from '../repositories/IPagoRepository';
import { Pago } from '../entities/pago';

export class RegistrarSalidaUseCase {
    constructor(
        private logRepository: ILogRepository,
        private parqueaderoRepository: IParqueaderoRepository,
        private pagoRepository: IPagoRepository
    ) {}

    async ejecutar(idParqueadero: number, idUsuario: number): Promise<{ monto: number }> {
        const parqueadero = await this.parqueaderoRepository.buscarPorId(idParqueadero);

        if (!parqueadero) {
            throw new Error("Parqueadero no encontrado");
        }

        const horaSalida = new Date();
        const duracionMinutos = await this.logRepository.registrarSalida(idParqueadero, horaSalida);
        
        const horas = Math.ceil((duracionMinutos ?? 1) / 60);
        const monto = horas * 1;

        const pago = new Pago(idUsuario, idParqueadero, monto, 'tarjeta');
        await this.pagoRepository.guardar(pago);

        await this.parqueaderoRepository.cambiarEstado(idParqueadero, 'libre');

        return { monto };
    }
}