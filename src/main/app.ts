import express from "express";
import authRouter from "../routes/auth.routes";
import reservaRouter from "../routes/reserva.routes";

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/reserva', reservaRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});