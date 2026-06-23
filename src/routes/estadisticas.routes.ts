import express from 'express';
import { estadisticasRepo } from '../infrastructure/repositories/instances';

const router = express.Router();

router.get('/ocupacion-promedio', async (req, res) => {
    try {
        const promedio = await estadisticasRepo.ocupacionPromedio();
        res.json({ ocupacionPromedio: promedio });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/horas-pico', async (req, res) => {
    try {
        const horas = await estadisticasRepo.horasPico();
        res.json(horas);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/tiempo-promedio', async (req, res) => {
    try {
        const tiempo = await estadisticasRepo.tiempoPromedioEstadia();
        res.json({ tiempoPromedio: tiempo });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/parqueaderos-mas-reservados', async (req, res) => {
    try {
        const parqueaderos = await estadisticasRepo.parqueaderosMasReservados();
        res.json(parqueaderos);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/reservas-usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const cantidad = await estadisticasRepo.reservasPorUsuario(idUsuario);
        res.json({ reservas: cantidad });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/ingresos-totales', async (req, res) => {
    try {
        const total = await estadisticasRepo.ingresosTotales();
        res.json({ ingresosTotales: total });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/metodo-pago', async (req, res) => {
    try {
        const metodo = await estadisticasRepo.metodoPagoMasUsado();
        res.json({ metodoPagoMasUsado: metodo });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/rango', async (req, res) => {
    const { inicio, fin } = req.query;
    try {
        const logs = await estadisticasRepo.buscarPorRango(new Date(inicio as string), new Date(fin as string));
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/series-tiempo', async (req, res) => {
    try {
        const series = estadisticasRepo.obtenerSeriesTiempo();
        res.json(series);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
