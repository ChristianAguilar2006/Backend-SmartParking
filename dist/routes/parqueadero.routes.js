"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asignarEspacio_1 = require("../domain/use-cases/asignarEspacio");
const cambiarEstado_1 = require("../domain/use-cases/cambiarEstado");
const MysqlParqueaderoRepository_1 = require("../infrastructure/repositories/MysqlParqueaderoRepository");
const router = express_1.default.Router();
router.post('/asignar', async (req, res) => {
    const { tipo } = req.body;
    try {
        const espacio = await new asignarEspacio_1.AsignarEspacioUseCase(new MysqlParqueaderoRepository_1.MysqlParqueaderoRepository()).ejecutar(tipo);
        res.json({ mensaje: "Espacio asignado", parqueadero: espacio });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/estado', async (req, res) => {
    const { idParqueadero, estado } = req.body;
    try {
        await new cambiarEstado_1.CambiarEstadoUseCase(new MysqlParqueaderoRepository_1.MysqlParqueaderoRepository()).ejecutar(idParqueadero, estado);
        res.json({ mensaje: "Estado actualizado correctamente" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/libres', async (req, res) => {
    try {
        const libres = await new MysqlParqueaderoRepository_1.MysqlParqueaderoRepository().buscarLibres();
        res.json(libres);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/matriz', async (req, res) => {
    try {
        const repo = new MysqlParqueaderoRepository_1.MysqlParqueaderoRepository();
        const matriz = await repo.cargarMatrizDesdeBD();
        res.json(matriz);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
