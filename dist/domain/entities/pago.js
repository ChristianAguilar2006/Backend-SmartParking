"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pago = void 0;
class Pago {
    constructor(idUsuario, idParqueadero, monto, metodo) {
        this.idUsuario = idUsuario;
        this.idParqueadero = idParqueadero;
        this.monto = monto;
        this.metodo = metodo;
        this.estado = 'pendiente';
    }
}
exports.Pago = Pago;
