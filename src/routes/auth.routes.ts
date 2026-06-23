import express from 'express';
import { RegisterUseCase } from '../domain/use-cases/register';
import { LoginUseCase } from '../domain/use-cases/login';
import { loginHistoryManager, tokenManager, usuarioRepo } from '../infrastructure/repositories/instances';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, contrasenia } = req.body;
    try {
        const resultado = await new LoginUseCase(usuarioRepo, tokenManager, loginHistoryManager).ejecutar(email, contrasenia);
        if (resultado) {
            res.json(resultado);
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    const { nombre, idRol, email, contrasenia } = req.body;
    try {
        await new RegisterUseCase(usuarioRepo).registrar(nombre, idRol, email, contrasenia);
        res.json({ mensaje: 'Se guardó correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
