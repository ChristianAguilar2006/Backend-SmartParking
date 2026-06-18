"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarEntradaUseCase = void 0;
const log_1 = require("../entities/log");
class RegistrarEntradaUseCase {
    constructor(logRepository, parqueaderoRepository) {
        this.logRepository = logRepository;
        this.parqueaderoRepository = parqueaderoRepository;
    }
    async ejecutar(idParqueadero, idUsuario, placa) {
        const parqueadero = await this.parqueaderoRepository.buscarPorId(idParqueadero);
        if (!parqueadero) {
            throw new Error("Parqueadero no encontrado");
        }
        if (!parqueadero.estaDisponible()) {
            throw new Error("El parqueadero no está disponible");
        }
        const log = new log_1.Log(idParqueadero, idUsuario, placa, new Date(), 'entrada');
        await this.logRepository.guardar(log);
        await this.parqueaderoRepository.cambiarEstado(idParqueadero, 'ocupado');
    }
}
exports.RegistrarEntradaUseCase = RegistrarEntradaUseCase;
