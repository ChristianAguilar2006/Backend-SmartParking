"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearReservaUseCase = void 0;
const reserva_1 = require("../entities/reserva");
const pago_1 = require("../entities/pago");
class CrearReservaUseCase {
    constructor(reservaRepository, pagoRepository, parqueaderoRepository) {
        this.reservaRepository = reservaRepository;
        this.pagoRepository = pagoRepository;
        this.parqueaderoRepository = parqueaderoRepository;
    }
    async ejecutar(idUsuario, fecha, horaInicio, horaFin, tipo) {
        const libres = await this.parqueaderoRepository.buscarLibres();
        const delTipo = libres.filter(p => p.tipo === tipo);
        if (delTipo.length === 0) {
            throw new Error("No hay espacios disponibles para ese tipo de vehículo");
        }
        const optimo = delTipo[0];
        const reserva = new reserva_1.Reserva(optimo.idParqueadero, idUsuario, fecha, horaInicio, horaFin);
        reserva.validarHoras();
        const [hIni, mIni] = horaInicio.split(':').map(Number);
        const [hFin, mFin] = horaFin.split(':').map(Number);
        const minutos = (hFin * 60 + mFin) - (hIni * 60 + mIni);
        const horas = Math.ceil(minutos / 60);
        const monto = horas * 1;
        await this.reservaRepository.guardar(reserva);
        await this.parqueaderoRepository.cambiarEstado(optimo.idParqueadero, 'reservado');
        const pago = new pago_1.Pago(idUsuario, optimo.idParqueadero, monto, 'tarjeta');
        await this.pagoRepository.guardar(pago);
        return reserva;
    }
}
exports.CrearReservaUseCase = CrearReservaUseCase;
