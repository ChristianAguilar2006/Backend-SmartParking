import express from 'express';
import { ProcesarPagoUseCase } from '../domain/use-cases/procesarPago';
import { ConfirmarPagoUseCase } from '../domain/use-cases/confirmarPago';
import { pagoRepo } from '../infrastructure/repositories/instances';

const router = express.Router();

router.post('/procesar', async (req, res) => {
    const { idUsuario, idParqueadero, monto, metodo, idReserva } = req.body;
    try {
        await new ProcesarPagoUseCase(pagoRepo).ejecutar(idUsuario, idParqueadero, monto, metodo, idReserva);
        res.json({ mensaje: 'Pago procesado correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/confirmar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await new ConfirmarPagoUseCase(pagoRepo).ejecutar(idPago);
        res.json({ mensaje: 'Pago confirmado correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/rechazar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await pagoRepo.rechazarPago(idPago);
        res.json({ mensaje: 'Pago rechazado' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const pagos = await pagoRepo.buscarPorUsuario(idUsuario);
        res.json(pagos);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const logs = pagoRepo.obtenerLogs();
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/cola', async (req, res) => {
    try {
        const cola = await pagoRepo.cargarColaDesdeBD();
        res.json(cola);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
