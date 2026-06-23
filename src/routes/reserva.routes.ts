import express from 'express';
import { CrearReservaUseCase } from '../domain/use-cases/crearReserva';
import { CancelarReservaUseCase } from '../domain/use-cases/cancelarReserva';
import { parqueaderoRepo, pagoRepo, reservaRepo } from '../infrastructure/repositories/instances';

const router = express.Router();

router.post('/crear', async (req, res) => {
    const { idUsuario, fecha, horaInicio, horaFin, tipo } = req.body;
    try {
        const reserva = await new CrearReservaUseCase(reservaRepo, pagoRepo, parqueaderoRepo).ejecutar(
            idUsuario, new Date(fecha), horaInicio, horaFin, tipo
        );
        res.json({ mensaje: 'Reserva creada correctamente', reserva });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/cancelar', async (req, res) => {
    const { idReserva } = req.body;
    try {
        await new CancelarReservaUseCase(reservaRepo).ejecutar(idReserva);
        res.json({ mensaje: 'Reserva cancelada correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/fecha', async (req, res) => {
    const { fecha } = req.body;
    try {
        const reservas = await reservaRepo.buscarPorFecha(new Date(fecha));
        res.json(reservas);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/usuario/:idUsuario', async (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    try {
        const reservas = await reservaRepo.buscarPorIdUsuario(idUsuario);
        res.json(reservas);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
