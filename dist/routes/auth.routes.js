"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = require("../domain/use-cases/register");
const login_1 = require("../domain/use-cases/login");
const instances_1 = require("../infrastructure/repositories/instances");
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    const { email, contrasenia } = req.body;
    try {
        const resultado = await new login_1.LoginUseCase(instances_1.usuarioRepo, instances_1.tokenManager, instances_1.loginHistoryManager).ejecutar(email, contrasenia);
        if (resultado) {
            res.json(resultado);
        }
        else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/register', async (req, res) => {
    const { nombre, idRol, email, contrasenia } = req.body;
    try {
        await new register_1.RegisterUseCase(instances_1.usuarioRepo).registrar(nombre, idRol, email, contrasenia);
        res.json({ mensaje: 'Se guardó correctamente' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
