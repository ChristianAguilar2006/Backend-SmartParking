import express from "express";
import authRouter from "../routes/auth.routes";
import reservaRouter from "../routes/reserva.routes";
import parqueaderoRouter from '../routes/parqueadero.routes';
import monitoreoRouter from '../routes/monitoreo.routes';
import estadisticasRouter from '../routes/estadisticas.routes';
import cors from 'cors';
const app = express();
app.use(cors());
app.use('/estadisticas', estadisticasRouter);

app.use(express.json());
app.use('/auth', authRouter);
app.use('/reserva', reservaRouter);
app.use('/parqueadero', parqueaderoRouter);
app.use('/monitoreo', monitoreoRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});