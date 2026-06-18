"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarSalidaUseCase = void 0;
const pago_1 = require("../entities/pago");
class RegistrarSalidaUseCase {
    constructor(logRepository, parqueaderoRepository, pagoRepository) {
        this.logRepository = logRepository;
        this.parqueaderoRepository = parqueaderoRepository;
        this.pagoRepository = pagoRepository;
    }
    async ejecutar(idParqueadero, idUsuario) {
        const parqueadero = await this.parqueaderoRepository.buscarPorId(idParqueadero);
        if (!parqueadero) {
            throw new Error("Parqueadero no encontrado");
        }
        const horaSalida = new Date();
        const duracionMinutos = await this.logRepository.registrarSalida(idParqueadero, horaSalida);
        const horas = Math.ceil((duracionMinutos ?? 1) / 60);
        const monto = horas * 1;
        const pago = new pago_1.Pago(idUsuario, idParqueadero, monto, 'tarjeta');
        await this.pagoRepository.guardar(pago);
        await this.parqueaderoRepository.cambiarEstado(idParqueadero, 'libre');
        return { monto };
    }
}
exports.RegistrarSalidaUseCase = RegistrarSalidaUseCase;
