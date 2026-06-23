import express from 'express';
import { RegistrarEntradaUseCase } from '../domain/use-cases/registrarEntrada';
import { RegistrarSalidaUseCase } from '../domain/use-cases/registrarSalida';
import { logRepo, parqueaderoRepo, pagoRepo } from '../infrastructure/repositories/instances';

const router = express.Router();

router.post('/entrada', async (req, res) => {
    const { idParqueadero, idUsuario, placa } = req.body;
    try {
        await new RegistrarEntradaUseCase(logRepo, parqueaderoRepo).ejecutar(idParqueadero, idUsuario, placa);
        res.json({ mensaje: 'Entrada registrada correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/salida', async (req, res) => {
    const { idParqueadero, idUsuario } = req.body;
    try {
        const resultado = await new RegistrarSalidaUseCase(logRepo, parqueaderoRepo, pagoRepo).ejecutar(idParqueadero, idUsuario);
        res.json({ mensaje: 'Salida registrada correctamente', monto: resultado.monto });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/matriz', async (req, res) => {
    try {
        const matriz = await parqueaderoRepo.cargarMatrizDesdeBD();
        res.json(matriz);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/cola-eventos', async (req, res) => {
    try {
        const eventos = logRepo.obtenerColaEventos();
        res.json(eventos);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/parqueadero/:idParqueadero', async (req, res) => {
    const idParqueadero = parseInt(req.params.idParqueadero);
    try {
        const logs = await logRepo.buscarPorParqueadero(idParqueadero);
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/placa/:placa', async (req, res) => {
    const { placa } = req.params;
    try {
        const logs = await logRepo.buscarPorPlaca(placa);
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
