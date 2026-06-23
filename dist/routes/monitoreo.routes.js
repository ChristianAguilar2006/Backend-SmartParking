"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrarEntrada_1 = require("../domain/use-cases/registrarEntrada");
const registrarSalida_1 = require("../domain/use-cases/registrarSalida");
const instances_1 = require("../infrastructure/repositories/instances");
const router = express_1.default.Router();
router.post('/entrada', async (req, res) => {
    const { idParqueadero, idUsuario, placa } = req.body;
    try {
        await new registrarEntrada_1.RegistrarEntradaUseCase(instances_1.logRepo, instances_1.parqueaderoRepo).ejecutar(idParqueadero, idUsuario, placa);
        res.json({ mensaje: 'Entrada registrada correctamente' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/salida', async (req, res) => {
    const { idParqueadero, idUsuario } = req.body;
    try {
        const resultado = await new registrarSalida_1.RegistrarSalidaUseCase(instances_1.logRepo, instances_1.parqueaderoRepo, instances_1.pagoRepo).ejecutar(idParqueadero, idUsuario);
        res.json({ mensaje: 'Salida registrada correctamente', monto: resultado.monto });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/matriz', async (req, res) => {
    try {
        const matriz = await instances_1.parqueaderoRepo.cargarMatrizDesdeBD();
        res.json(matriz);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/cola-eventos', async (req, res) => {
    try {
        const eventos = instances_1.logRepo.obtenerColaEventos();
        res.json(eventos);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/parqueadero/:idParqueadero', async (req, res) => {
    const idParqueadero = parseInt(req.params.idParqueadero);
    try {
        const logs = await instances_1.logRepo.buscarPorParqueadero(idParqueadero);
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/placa/:placa', async (req, res) => {
    const { placa } = req.params;
    try {
        const logs = await instances_1.logRepo.buscarPorPlaca(placa);
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
