import { IReservaRepository } from '../repositories/IReservaRepository';
import { IPagoRepository } from '../repositories/IPagoRepository';
import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';
import { Reserva } from '../entities/reserva';
import { Pago } from '../entities/pago';

export class CrearReservaUseCase {
    constructor(
        private reservaRepository: IReservaRepository,
        private pagoRepository: IPagoRepository,
        private parqueaderoRepository: IParqueaderoRepository
    ) {}

    async ejecutar(
        idUsuario: number,
        fecha: Date,
        horaInicio: string,
        horaFin: string,
        tipo: 'auto' | 'moto' | 'bicicleta' | 'discapacidad'
    ): Promise<Reserva> {
        const libres = await this.parqueaderoRepository.buscarLibres();
        const delTipo = libres.filter(p => p.tipo === tipo);

        if (delTipo.length === 0) {
            throw new Error("No hay espacios disponibles para ese tipo de vehículo");
        }

        const optimo = delTipo[0];

        const reserva = new Reserva(optimo.idParqueadero!, idUsuario, fecha, horaInicio, horaFin);
        reserva.validarHoras();

        const [hIni, mIni] = horaInicio.split(':').map(Number);
        const [hFin, mFin] = horaFin.split(':').map(Number);
        const minutos = (hFin * 60 + mFin) - (hIni * 60 + mIni);
        const horas = Math.ceil(minutos / 60);
        const monto = horas * 1;

        await this.reservaRepository.guardar(reserva);
        await this.parqueaderoRepository.cambiarEstado(optimo.idParqueadero!, 'reservado');
        const pago = new Pago(idUsuario, optimo.idParqueadero!, monto, 'tarjeta');
        await this.pagoRepository.guardar(pago);
        return reserva;
    }
}