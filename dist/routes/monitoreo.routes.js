"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrarEntrada_1 = require("../domain/use-cases/registrarEntrada");
const registrarSalida_1 = require("../domain/use-cases/registrarSalida");
const MysqlLogRepository_1 = require("../infrastructure/repositories/MysqlLogRepository");
const MysqlParqueaderoRepository_1 = require("../infrastructure/repositories/MysqlParqueaderoRepository");
const MysqlPagoRepository_1 = require("../infrastructure/repositories/MysqlPagoRepository");
const router = express_1.default.Router();
router.post('/entrada', async (req, res) => {
    const { idParqueadero, idUsuario, placa } = req.body;
    try {
        await new registrarEntrada_1.RegistrarEntradaUseCase(new MysqlLogRepository_1.MysqlLogRepository(), new MysqlParqueaderoRepository_1.MysqlParqueaderoRepository()).ejecutar(idParqueadero, idUsuario, placa);
        res.json({ mensaje: "Entrada registrada correctamente" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/salida', async (req, res) => {
    const { idParqueadero, idUsuario } = req.body;
    try {
        const resultado = await new registrarSalida_1.RegistrarSalidaUseCase(new MysqlLogRepository_1.MysqlLogRepository(), new MysqlParqueaderoRepository_1.MysqlParqueaderoRepository(), new MysqlPagoRepository_1.MysqlPagoRepository()).ejecutar(idParqueadero, idUsuario);
        res.json({ mensaje: "Salida registrada correctamente", monto: resultado.monto });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/parqueadero/:idParqueadero', async (req, res) => {
    const idParqueadero = parseInt(req.params.idParqueadero);
    try {
        const logs = await new MysqlLogRepository_1.MysqlLogRepository().buscarPorParqueadero(idParqueadero);
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/placa/:placa', async (req, res) => {
    const { placa } = req.params;
    try {
        const logs = await new MysqlLogRepository_1.MysqlLogRepository().buscarPorPlaca(placa);
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
