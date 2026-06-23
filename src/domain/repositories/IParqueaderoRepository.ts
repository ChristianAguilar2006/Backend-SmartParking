import { Parqueadero } from '../entities/parqueadero';

export abstract class IParqueaderoRepository {
    abstract guardar(parqueadero: Parqueadero): Promise<void>;
    abstract buscarPorId(id: number): Promise<Parqueadero | null>;
    abstract buscarLibres(): Promise<Parqueadero[]>;
    abstract cambiarEstado(id: number, estado: 'libre' | 'ocupado' | 'reservado' | 'mantenimiento' | 'bloqueado'): Promise<void>;
    abstract obtenerEspacioOptimo(tipo: 'auto' | 'moto' | 'bicicleta' | 'discapacidad'): Promise<Parqueadero>;
    abstract cargarMatrizDesdeBD(): Promise<string[][]>;
}