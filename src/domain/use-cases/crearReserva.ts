import { IReservaRepository } from '../repositories/IReservaRepository';
import { Reserva } from '../entities/reserva';

export class CrearReservaUseCase {
    constructor(private reservaRepository: IReservaRepository) {}

    async ejecutar(
        idParqueadero: number,
        idUsuario: number,
        fecha: Date,
        horaInicio: string,
        horaFin: string
    ): Promise<void> {
        const reserva = new Reserva(idParqueadero, idUsuario, fecha, horaInicio, horaFin);
        reserva.validarHoras();
        await this.reservaRepository.guardar(reserva);
    }
}