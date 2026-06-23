"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const procesarPago_1 = require("../domain/use-cases/procesarPago");
const confirmarPago_1 = require("../domain/use-cases/confirmarPago");
const instances_1 = require("../infrastructure/repositories/instances");
const router = express_1.default.Router();
router.post('/procesar', async (req, res) => {
    const { idUsuario, idParqueadero, monto, metodo, idReserva } = req.body;
    try {
        await new procesarPago_1.ProcesarPagoUseCase(instances_1.pagoRepo).ejecutar(idUsuario, idParqueadero, monto, metodo, idReserva);
        res.json({ mensaje: 'Pago procesado correctamente' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/confirmar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await new confirmarPago_1.ConfirmarPagoUseCase(instances_1.pagoRepo).ejecutar(idPago);
        res.json({ mensaje: 'Pago confirmado correctamente' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/rechazar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await instances_1.pagoRepo.rechazarPago(idPago);
        res.json({ mensaje: 'Pago rechazado' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const pagos = await instances_1.pagoRepo.buscarPorUsuario(idUsuario);
        res.json(pagos);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/logs', async (req, res) => {
    try {
        const logs = instances_1.pagoRepo.obtenerLogs();
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/cola', async (req, res) => {
    try {
        const cola = await instances_1.pagoRepo.cargarColaDesdeBD();
        res.json(cola);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
