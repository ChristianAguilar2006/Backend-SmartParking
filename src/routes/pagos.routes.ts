import express from 'express';
import {ProcesarPagoUseCase} from '../domain/use-cases/procesarPago'
import { ConfirmarPagoUseCase } from '../domain/use-cases/confirmarPago';

import { MysqlPagoRepository } from '../infrastructure/repositories/MysqlPagoRepository';
import { RechazarPagoUseCase } from '../domain/use-cases/rechazarPago';

const router = express.Router();

router.post('/procesar', async (req, res) => {
    const { idUsuario, idParqueadero, monto, metodo, idReserva } = req.body;
    try {
        await new ProcesarPagoUseCase(new MysqlPagoRepository()).ejecutar(
            idUsuario, idParqueadero, monto, metodo, idReserva
        );
        res.json({ mensaje: "Pago procesado correctamente" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/confirmar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await new ConfirmarPagoUseCase(new MysqlPagoRepository()).ejecutar(idPago);
        res.json({ mensaje: "Pago confirmado correctamente" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/rechazar', async (req, res) => {
    const { idPago } = req.body;
    try {
        await new MysqlPagoRepository().rechazarPago(idPago);
        res.json({ mensaje: "Pago rechazado" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const pagos = await new MysqlPagoRepository().buscarPorUsuario(idUsuario);
        res.json(pagos);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const logs = new MysqlPagoRepository().obtenerLogs();
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;