export class Pago {
    idPago?: number;
    idUsuario: number;
    idReserva?: number;
    idParqueadero: number;
    monto: number;
    metodo: 'tarjeta' | 'transferencia' | 'billetera';
    estado: 'pendiente' | 'confirmado' | 'fallido';
    createdAt?: Date;

    constructor(
        idUsuario: number,
        idParqueadero: number,
        monto: number,
        metodo: 'tarjeta' | 'transferencia' | 'billetera'
    ) {
        this.idUsuario = idUsuario;
        this.idParqueadero = idParqueadero;
        this.monto = monto;
        this.metodo = metodo;
        this.estado = 'pendiente';
    }
}