"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const procesarPago_1 = require("../domain/use-cases/procesarPago");
const confirmarPago_1 = require("../domain/use-cases/confirmarPago");
const MysqlPagoRepository_1 = require("../infrastructure/repositories/MysqlPagoRepository");
const router = express_1.default.Router();
router.post('/procesar', async (req, res) => {
    const { idUsuario, idParqueadero, monto, metodo, idReserva } = req.body;
    try {
        await new procesarPago_1.ProcesarPagoUseCase(new MysqlPagoRepository_1.MysqlPagoRepository()).ejecutar(idUsuario, idParqueadero, monto, metodo, idReserva);
        res.json({ mensaje: "Pago procesado correctamente" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/confirmar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await new confirmarPago_1.ConfirmarPagoUseCase(new MysqlPagoRepository_1.MysqlPagoRepository()).ejecutar(idPago);
        res.json({ mensaje: "Pago confirmado correctamente" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/rechazar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await new MysqlPagoRepository_1.MysqlPagoRepository().rechazarPago(idPago);
        res.json({ mensaje: "Pago rechazado" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const pagos = await new MysqlPagoRepository_1.MysqlPagoRepository().buscarPorUsuario(idUsuario);
        res.json(pagos);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/logs', async (req, res) => {
    try {
        const logs = new MysqlPagoRepository_1.MysqlPagoRepository().obtenerLogs();
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
