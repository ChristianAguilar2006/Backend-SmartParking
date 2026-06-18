"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = require("../domain/use-cases/register");
const MysqlUsuarioRepository_1 = require("../infrastructure/repositories/MysqlUsuarioRepository");
// IMPORTS NECESARIOS PARA EL LOGIN
const login_1 = require("../domain/use-cases/login");
const SesionMemoria_1 = require("../infrastructure/repositories/SesionMemoria");
const IntentosFallidosManager_1 = require("../infrastructure/repositories/IntentosFallidosManager");
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    const { email, contrasenia } = req.body;
    try {
        const resultado = await new login_1.LoginUseCase(new MysqlUsuarioRepository_1.UsuarioMySQL(), new SesionMemoria_1.TokenManager(), new IntentosFallidosManager_1.LoginHistoryManager()).ejecutar(email, contrasenia);
        if (resultado) {
            res.json(resultado);
        }
        else {
            res.status(401).json({ error: "Credenciales inválidas" });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/register', async (req, res) => {
    const { nombre, idRol, email, contrasenia } = req.body;
    try {
        await new register_1.RegisterUseCase(new MysqlUsuarioRepository_1.UsuarioMySQL()).registrar(nombre, idRol, email, contrasenia);
        res.json({ mensaje: "Se guardó correctamente" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
