import { Reserva } from '../entities/reserva';

export abstract class IReservaRepository {
    abstract guardar(reserva: Reserva): Promise<void>;
    abstract buscarPorFecha(fecha: Date): Promise<Reserva[]>;
    abstract buscarPorIdUsuario(idUsuario: number): Promise<Reserva[]>;
    abstract cancelar(idReserva: number): Promise<void>;
}