"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const reserva_routes_1 = __importDefault(require("../routes/reserva.routes"));
const parqueadero_routes_1 = __importDefault(require("../routes/parqueadero.routes"));
const monitoreo_routes_1 = __importDefault(require("../routes/monitoreo.routes"));
const estadisticas_routes_1 = __importDefault(require("../routes/estadisticas.routes"));
const pagos_routes_1 = __importDefault(require("../routes/pagos.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/estadisticas', estadisticas_routes_1.default);
app.use(express_1.default.json());
app.use('/auth', auth_routes_1.default);
app.use('/reserva', reserva_routes_1.default);
app.use('/parqueadero', parqueadero_routes_1.default);
app.use('/monitoreo', monitoreo_routes_1.default);
app.use('/pago', pagos_routes_1.default);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
