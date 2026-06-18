"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcesarPagoUseCase = void 0;
const pago_1 = require("../entities/pago");
class ProcesarPagoUseCase {
    constructor(pagoRepository) {
        this.pagoRepository = pagoRepository;
    }
    async ejecutar(idUsuario, idParqueadero, monto, metodo, idReserva) {
        const pago = new pago_1.Pago(idUsuario, idParqueadero, monto, metodo);
        if (idReserva)
            pago.idReserva = idReserva;
        await this.pagoRepository.guardar(pago);
    }
}
exports.ProcesarPagoUseCase = ProcesarPagoUseCase;
