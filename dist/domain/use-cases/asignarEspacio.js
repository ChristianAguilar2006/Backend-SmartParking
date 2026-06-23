"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignarEspacioUseCase = void 0;
class AsignarEspacioUseCase {
    constructor(parqueaderoRepository) {
        this.parqueaderoRepository = parqueaderoRepository;
    }
    async ejecutar(tipo) {
        const optimo = await this.parqueaderoRepository.obtenerEspacioOptimo(tipo);
        await this.parqueaderoRepository.cambiarEstado(optimo.idParqueadero, 'ocupado');
        return optimo;
    }
}
exports.AsignarEspacioUseCase = AsignarEspacioUseCase;
