"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CambiarEstadoUseCase = void 0;
class CambiarEstadoUseCase {
    constructor(parqueaderoRepository) {
        this.parqueaderoRepository = parqueaderoRepository;
    }
    async ejecutar(idParqueadero, estado) {
        await this.parqueaderoRepository.cambiarEstado(idParqueadero, estado);
    }
}
exports.CambiarEstadoUseCase = CambiarEstadoUseCase;
