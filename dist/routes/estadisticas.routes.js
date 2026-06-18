"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MysqlEstadisticasRepository_1 = require("../infrastructure/repositories/MysqlEstadisticasRepository");
const router = express_1.default.Router();
router.get('/ocupacion-promedio', async (req, res) => {
    try {
        const promedio = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().ocupacionPromedio();
        res.json({ ocupacionPromedio: promedio });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/horas-pico', async (req, res) => {
    try {
        const horas = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().horasPico();
        res.json(horas);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/tiempo-promedio', async (req, res) => {
    try {
        const tiempo = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().tiempoPromedioEstadia();
        res.json({ tiempoPromedio: tiempo });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/parqueaderos-mas-reservados', async (req, res) => {
    try {
        const parqueaderos = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().parqueaderosMasReservados();
        res.json(parqueaderos);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/reservas-usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const cantidad = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().reservasPorUsuario(idUsuario);
        res.json({ reservas: cantidad });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/ingresos-totales', async (req, res) => {
    try {
        const total = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().ingresosTotales();
        res.json({ ingresosTotales: total });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/metodo-pago', async (req, res) => {
    try {
        const metodo = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().metodoPagoMasUsado();
        res.json({ metodoPagoMasUsado: metodo });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/rango', async (req, res) => {
    const { inicio, fin } = req.query;
    try {
        const logs = await new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().buscarPorRango(new Date(inicio), new Date(fin));
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/series-tiempo', async (req, res) => {
    try {
        const series = new MysqlEstadisticasRepository_1.MysqlEstadisticasRepository().obtenerSeriesTiempo();
        res.json(series);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
