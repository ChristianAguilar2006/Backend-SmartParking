import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';
import { IReservaRepository } from '../repositories/IReservaRepository';
import { IPagoRepository } from '../repositories/IPagoRepository';
import { Reserva } from '../entities/reserva';
import { Pago } from '../entities/pago';

function haySuperposicion(inicioA: string, finA: string, inicioB: string, finB: string): boolean {
    return inicioA < finB && inicioB < finA;
}

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
        const optimo = await this.parqueaderoRepository.obtenerEspacioOptimo(tipo);

        const reservasDelDia = await this.reservaRepository.buscarPorFecha(fecha);
        const conflicto = reservasDelDia.some(
            (r) =>
                r.idParqueadero === optimo.idParqueadero &&
                r.estado !== 'cancelada' &&
                haySuperposicion(horaInicio, horaFin, r.horaInicio, r.horaFin)
        );

        if (conflicto) {
            throw new Error('Conflicto de horario en el espacio seleccionado');
        }

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
        pago.idReserva = reserva.idReserva;
        await this.pagoRepository.guardar(pago);
        return reserva;
    }
}
