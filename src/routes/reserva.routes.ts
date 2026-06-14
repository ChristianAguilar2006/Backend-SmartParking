import express from 'express';
import { CrearReservaUseCase } from '../domain/use-cases/crearReserva';
import { CancelarReservaUseCase } from '../domain/use-cases/cancelarReserva';
import { MysqlReservaRepository } from '../infrastructure/repositories/MysqlReservaRepository';

const router = express.Router();

router.post('/crear', async (req, res) => {
    const { idParqueadero, idUsuario, fecha, horaInicio, horaFin } = req.body;
    try {
        await new CrearReservaUseCase(new MysqlReservaRepository()).ejecutar(
            idParqueadero, idUsuario, new Date(fecha), horaInicio, horaFin
        );
        res.json({ mensaje: "Reserva creada correctamente" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/cancelar', async (req, res) => {
    const { idReserva } = req.body;
    try {
        await new CancelarReservaUseCase(new MysqlReservaRepository()).ejecutar(idReserva);
        res.json({ mensaje: "Reserva cancelada correctamente" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;