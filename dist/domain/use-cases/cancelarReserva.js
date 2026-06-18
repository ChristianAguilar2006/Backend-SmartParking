"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelarReservaUseCase = void 0;
class CancelarReservaUseCase {
    constructor(reservaRepository) {
        this.reservaRepository = reservaRepository;
    }
    async ejecutar(idReserva) {
        await this.reservaRepository.cancelar(idReserva);
    }
}
exports.CancelarReservaUseCase = CancelarReservaUseCase;
