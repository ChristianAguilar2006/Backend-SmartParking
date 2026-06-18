"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmarPagoUseCase = void 0;
class ConfirmarPagoUseCase {
    constructor(pagoRepository) {
        this.pagoRepository = pagoRepository;
    }
    async ejecutar(idPago) {
        await this.pagoRepository.confirmarPago(idPago);
    }
}
exports.ConfirmarPagoUseCase = ConfirmarPagoUseCase;
