"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    constructor(idParqueadero, idUsuario, placa, horaEntrada, tipoRegistro) {
        this.idParqueadero = idParqueadero;
        this.idUsuario = idUsuario;
        this.placa = placa;
        this.horaEntrada = horaEntrada;
        this.tipoRegistro = tipoRegistro;
    }
}
exports.Log = Log;
