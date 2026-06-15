export class Log {
    idLog?: number;
    idParqueadero: number;
    idUsuario: number;
    placa: string;
    horaEntrada: Date;
    horaSalida?: Date;
    tipoRegistro: 'entrada' | 'salida' | 'reserva_cumplida' | 'reserva_cancelada';
    registradoPor?: number;
    createdAt?: Date;

    constructor(
        idParqueadero: number,
        idUsuario: number,
        placa: string,
        horaEntrada: Date,
        tipoRegistro: 'entrada' | 'salida' | 'reserva_cumplida' | 'reserva_cancelada'
    ) {
        this.idParqueadero = idParqueadero;
        this.idUsuario = idUsuario;
        this.placa = placa;
        this.horaEntrada = horaEntrada;
        this.tipoRegistro = tipoRegistro;
    }
}