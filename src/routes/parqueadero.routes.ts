import express from 'express';
import { AsignarEspacioUseCase } from '../domain/use-cases/asignarEspacio';
import { CambiarEstadoUseCase } from '../domain/use-cases/cambiarEstado';
import { MysqlParqueaderoRepository } from '../infrastructure/repositories/MysqlParqueaderoRepository';

const router = express.Router();

router.post('/asignar', async (req, res) => {
    const { tipo } = req.body;
    try {
        const espacio = await new AsignarEspacioUseCase(new MysqlParqueaderoRepository()).ejecutar(tipo);
        res.json({ mensaje: "Espacio asignado", parqueadero: espacio });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/estado', async (req, res) => {
    const { idParqueadero, estado } = req.body;
    try {
        await new CambiarEstadoUseCase(new MysqlParqueaderoRepository()).ejecutar(idParqueadero, estado);
        res.json({ mensaje: "Estado actualizado correctamente" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/libres', async (req, res) => {
    try {
        const libres = await new MysqlParqueaderoRepository().buscarLibres();
        res.json(libres);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/matriz', async (req, res) => {
    try {
        const repo = new MysqlParqueaderoRepository();
        res.json(repo.obtenerMatriz());
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
export default router;