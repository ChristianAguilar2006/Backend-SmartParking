"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RechazarPagoUseCase = void 0;
class RechazarPagoUseCase {
    constructor(pagoRepository) {
        this.pagoRepository = pagoRepository;
    }
    async ejecutar(idPago) {
        await this.pagoRepository.rechazarPago(idPago);
    }
}
exports.RechazarPagoUseCase = RechazarPagoUseCase;
