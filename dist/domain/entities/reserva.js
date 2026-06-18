"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reserva = void 0;
class Reserva {
    constructor(idParqueadero, idUsuario, fecha, horaInicio, horaFin) {
        this.idParqueadero = idParqueadero;
        this.idUsuario = idUsuario;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.estado = 'pendiente';
    }
    validarHoras() {
        if (this.horaFin <= this.horaInicio) {
            throw new Error("La hora de fin debe ser mayor a la hora de inicio");
        }
    }
}
exports.Reserva = Reserva;
