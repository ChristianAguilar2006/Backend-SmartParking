"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignarEspacioUseCase = void 0;
class AsignarEspacioUseCase {
    constructor(parqueaderoRepository) {
        this.parqueaderoRepository = parqueaderoRepository;
    }
    async ejecutar(tipo) {
        const libres = await this.parqueaderoRepository.buscarLibres();
        const delTipo = libres.filter(p => p.tipo === tipo);
        if (delTipo.length === 0) {
            throw new Error("No hay espacios disponibles para ese tipo de vehículo");
        }
        const optimo = delTipo[0];
        await this.parqueaderoRepository.cambiarEstado(optimo.idParqueadero, 'ocupado');
        return optimo;
    }
}
exports.AsignarEspacioUseCase = AsignarEspacioUseCase;
