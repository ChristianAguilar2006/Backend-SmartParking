export class Reserva {
    idReserva?: number;
    idParqueadero: number;
    idUsuario: number;
    fecha: Date;
    horaInicio: string;
    horaFin: string;
    estado: 'pendiente' | 'activa' | 'cancelada' | 'cumplida' | 'expirada';
    
    constructor(
        idParqueadero: number,
        idUsuario: number,
        fecha: Date,
        horaInicio: string,
        horaFin: string
    ) {
        this.idParqueadero = idParqueadero;
        this.idUsuario = idUsuario;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.estado = 'pendiente';
    }
    validarHoras(): void {
        if (this.horaFin <= this.horaInicio) {
            throw new Error("La hora de fin debe ser mayor a la hora de inicio");
        }
    }
}