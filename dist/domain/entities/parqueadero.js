"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parqueadero = void 0;
class Parqueadero {
    constructor(codigo, zona, tipo, estado = 'libre') {
        this.codigo = codigo;
        this.zona = zona;
        this.tipo = tipo;
        this.estado = estado;
    }
    estaDisponible() {
        return this.estado === 'libre';
    }
}
exports.Parqueadero = Parqueadero;
