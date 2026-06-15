import {Pago} from '../entities/pago'

export abstract class IPagoRepository {
    abstract guardar(pago: Pago): Promise<void>;
    abstract buscarPorUsuario(idUsuario: number): Promise<Pago[]>;
    abstract confirmarPago(idPago: number): Promise<void>;
    abstract rechazarPago(idPago: number): Promise<void>;
}