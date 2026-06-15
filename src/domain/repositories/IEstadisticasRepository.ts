import { Log } from '../entities/log';

export abstract class IEstadisticasRepository {
    abstract ocupacionPromedio(): Promise<number>;
    abstract horasPico(): Promise<{ hora: number, cantidad: number }[]>;
    abstract tiempoPromedioEstadia(): Promise<number>;
    abstract parqueaderosMasReservados(): Promise<{ idParqueadero: number, cantidad: number }[]>;
    abstract reservasPorUsuario(idUsuario: number): Promise<number>;
    abstract ingresosTotales(): Promise<number>;
    abstract metodoPagoMasUsado(): Promise<string>;
    abstract buscarPorRango(inicio: Date, fin: Date): Promise<Log[]>;
    abstract obtenerSeriesTiempo(): { fecha: Date, cantidad: number }[];
}