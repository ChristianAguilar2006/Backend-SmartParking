"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asignarEspacio_1 = require("../domain/use-cases/asignarEspacio");
const cambiarEstado_1 = require("../domain/use-cases/cambiarEstado");
const instances_1 = require("../infrastructure/repositories/instances");
const router = express_1.default.Router();
router.post('/asignar', async (req, res) => {
    const { tipo } = req.body;
    try {
        const espacio = await new asignarEspacio_1.AsignarEspacioUseCase(instances_1.parqueaderoRepo).ejecutar(tipo);
        res.json({ mensaje: 'Espacio asignado', parqueadero: espacio });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/estado', async (req, res) => {
    const { idParqueadero, estado } = req.body;
    try {
        await new cambiarEstado_1.CambiarEstadoUseCase(instances_1.parqueaderoRepo).ejecutar(idParqueadero, estado);
        res.json({ mensaje: 'Estado actualizado correctamente' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/libres', async (req, res) => {
    try {
        const libres = await instances_1.parqueaderoRepo.buscarLibres();
        res.json(libres);
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
exports.default = router;
