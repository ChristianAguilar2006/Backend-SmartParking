import express from 'express';
import { MysqlEstadisticasRepository } from '../infrastructure/repositories/MysqlEstadisticasRepository';

const router = express.Router();

router.get('/ocupacion-promedio', async (req, res) => {
    try {
        const promedio = await new MysqlEstadisticasRepository().ocupacionPromedio();
        res.json({ ocupacionPromedio: promedio });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/horas-pico', async (req, res) => {
    try {
        const horas = await new MysqlEstadisticasRepository().horasPico();
        res.json(horas);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/tiempo-promedio', async (req, res) => {
    try {
        const tiempo = await new MysqlEstadisticasRepository().tiempoPromedioEstadia();
        res.json({ tiempoPromedio: tiempo });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/parqueaderos-mas-reservados', async (req, res) => {
    try {
        const parqueaderos = await new MysqlEstadisticasRepository().parqueaderosMasReservados();
        res.json(parqueaderos);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/reservas-usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const cantidad = await new MysqlEstadisticasRepository().reservasPorUsuario(idUsuario);
        res.json({ reservas: cantidad });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/ingresos-totales', async (req, res) => {
    try {
        const total = await new MysqlEstadisticasRepository().ingresosTotales();
        res.json({ ingresosTotales: total });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/metodo-pago', async (req, res) => {
    try {
        const metodo = await new MysqlEstadisticasRepository().metodoPagoMasUsado();
        res.json({ metodoPagoMasUsado: metodo });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/rango', async (req, res) => {
    const { inicio, fin } = req.query;
    try {
        const logs = await new MysqlEstadisticasRepository().buscarPorRango(new Date(inicio as string), new Date(fin as string));
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/series-tiempo', async (req, res) => {
    try {
        const series = new MysqlEstadisticasRepository().obtenerSeriesTiempo();
        res.json(series);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;