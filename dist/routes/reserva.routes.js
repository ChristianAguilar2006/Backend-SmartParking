"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crearReserva_1 = require("../domain/use-cases/crearReserva");
const cancelarReserva_1 = require("../domain/use-cases/cancelarReserva");
const MysqlReservaRepository_1 = require("../infrastructure/repositories/MysqlReservaRepository");
const MysqlPagoRepository_1 = require("../infrastructure/repositories/MysqlPagoRepository");
const MysqlParqueaderoRepository_1 = require("../infrastructure/repositories/MysqlParqueaderoRepository");
const router = express_1.default.Router();
router.post('/crear', async (req, res) => {
    const { idUsuario, fecha, horaInicio, horaFin, tipo } = req.body;
    try {
        const reserva = await new crearReserva_1.CrearReservaUseCase(new MysqlReservaRepository_1.MysqlReservaRepository(), new MysqlPagoRepository_1.MysqlPagoRepository(), new MysqlParqueaderoRepository_1.MysqlParqueaderoRepository()).ejecutar(idUsuario, new Date(fecha), horaInicio, horaFin, tipo);
        res.json({ mensaje: "Reserva creada correctamente", reserva });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/cancelar', async (req, res) => {
    const { idReserva } = req.body;
    try {
        await new cancelarReserva_1.CancelarReservaUseCase(new MysqlReservaRepository_1.MysqlReservaRepository()).ejecutar(idReserva);
        res.json({ mensaje: "Reserva cancelada correctamente" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/fecha', async (req, res) => {
    const { fecha } = req.body;
    try {
        const reservas = await new MysqlReservaRepository_1.MysqlReservaRepository().buscarPorFecha(new Date(fecha));
        res.json(reservas);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const reservas = await new MysqlReservaRepository_1.MysqlReservaRepository().buscarPorIdUsuario(idUsuario);
        res.json(reservas);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
