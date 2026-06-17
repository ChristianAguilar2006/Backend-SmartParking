import express from 'express';
import { RegistrarEntradaUseCase } from '../domain/use-cases/registrarEntrada';

import {RegistrarSalidaUseCase } from '../domain/use-cases/registrarSalida';

import { MysqlLogRepository } from '../infrastructure/repositories/MysqlLogRepository';
import { MysqlParqueaderoRepository } from '../infrastructure/repositories/MysqlParqueaderoRepository';
import { MysqlPagoRepository } from '../infrastructure/repositories/MysqlPagoRepository';
const router = express.Router();

router.post('/entrada', async (req, res) => {
    const { idParqueadero, idUsuario, placa } = req.body;
    try {
        await new RegistrarEntradaUseCase(
            new MysqlLogRepository(),
            new MysqlParqueaderoRepository()
        ).ejecutar(idParqueadero, idUsuario, placa);
        res.json({ mensaje: "Entrada registrada correctamente" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/salida', async (req, res) => {
    const { idParqueadero, idUsuario } = req.body;
    try {
        const resultado = await new RegistrarSalidaUseCase(
            new MysqlLogRepository(),
            new MysqlParqueaderoRepository(),
            new MysqlPagoRepository()
        ).ejecutar(idParqueadero, idUsuario);
        res.json({ mensaje: "Salida registrada correctamente", monto: resultado.monto });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/parqueadero/:idParqueadero', async (req, res) => {
    const idParqueadero = parseInt(req.params.idParqueadero);
    try {
        const logs = await new MysqlLogRepository().buscarPorParqueadero(idParqueadero);
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/placa/:placa', async (req, res) => {
    const { placa } = req.params;
    try {
        const logs = await new MysqlLogRepository().buscarPorPlaca(placa);
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;