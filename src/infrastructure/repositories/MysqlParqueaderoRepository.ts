import { IParqueaderoRepository } from '../../domain/repositories/IParqueaderoRepository';
import { Parqueadero } from '../../domain/entities/parqueadero';
import { pool } from './database/mysql.connection';
import { MinHeap } from './MinHeap';
import { Matriz2D } from './Matriz2D';

export class MysqlParqueaderoRepository extends IParqueaderoRepository {
    private heap = new MinHeap();
    private matriz = new Matriz2D(10, 10);

    async guardar(parqueadero: Parqueadero): Promise<void> {
        await pool.execute(
            'INSERT INTO parqueaderos (codigo, zona, tipo, estado) VALUES (?, ?, ?, ?)',
            [parqueadero.codigo, parqueadero.zona, parqueadero.tipo, parqueadero.estado]
        );
        if (parqueadero.estado === 'libre') {
            this.heap.insertar(parqueadero);
        }
        const fila = Math.floor((parqueadero.idParqueadero! - 1) / 10);
        const columna = (parqueadero.idParqueadero! - 1) % 10;
        this.matriz.actualizar(fila, columna, parqueadero.estado);
    }

    async buscarPorId(id: number): Promise<Parqueadero | null> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM parqueaderos WHERE id_parqueadero = ?',
            [id]
        );
        if (rows.length === 0) return null;
        const fila = rows[0];
        const parqueadero = new Parqueadero(fila.codigo, fila.zona, fila.tipo, fila.estado);
        parqueadero.idParqueadero = fila.id_parqueadero;
        return parqueadero;
    }

    async buscarLibres(): Promise<Parqueadero[]> {
        const [rows]: any = await pool.execute(
            'SELECT * FROM parqueaderos WHERE estado = ? AND activo = TRUE',
            ['libre']
        );
        const libres = rows.map((fila: any) => {
            const parqueadero = new Parqueadero(fila.codigo, fila.zona, fila.tipo, fila.estado);
            parqueadero.idParqueadero = fila.id_parqueadero;
            this.heap.insertar(parqueadero);
            return parqueadero;
        });
        return libres;
    }

    async cambiarEstado(id: number, estado: 'libre' | 'ocupado' | 'reservado' | 'mantenimiento' | 'bloqueado'): Promise<void> {
        await pool.execute(
            'UPDATE parqueaderos SET estado = ? WHERE id_parqueadero = ?',
            [estado, id]
        );
        if (estado === 'ocupado') {
            this.heap.extraerMin();
        }
        const fila = Math.floor((id - 1) / 10);
        const columna = (id - 1) % 10;
        this.matriz.actualizar(fila, columna, estado);
    }

    obtenerMatriz(): string[][] {
        return this.matriz.obtenerTodo();
    }

    actualizarMatriz(fila: number, columna: number, estado: string): void {
        this.matriz.actualizar(fila, columna, estado);
    }
}