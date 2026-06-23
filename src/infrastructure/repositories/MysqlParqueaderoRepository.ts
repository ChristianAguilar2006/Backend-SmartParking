import { IParqueaderoRepository } from '../../domain/repositories/IParqueaderoRepository';
import { Parqueadero } from '../../domain/entities/parqueadero';
import { pool } from './database/mysql.connection';
import { MinHeap } from './MinHeap';
import { Matriz2D } from './Matriz2D';

export class MysqlParqueaderoRepository extends IParqueaderoRepository {
    private heap = new MinHeap();
    private matriz = new Matriz2D(10, 10);
    private hashMap = new Map<number, Parqueadero>(); // ← nuevo

    async guardar(parqueadero: Parqueadero): Promise<void> {
        await pool.execute(
            'INSERT INTO parqueaderos (codigo, zona, tipo, estado) VALUES (?, ?, ?, ?)',
            [parqueadero.codigo, parqueadero.zona, parqueadero.tipo, parqueadero.estado]
        );
        if (parqueadero.estado === 'libre') {
            this.heap.insertar(parqueadero);
        }
        this.hashMap.set(parqueadero.idParqueadero!, parqueadero); // ← nuevo
        const fila = Math.floor((parqueadero.idParqueadero! - 1) / 10);
        const columna = (parqueadero.idParqueadero! - 1) % 10;
        this.matriz.actualizar(fila, columna, parqueadero.estado);
    }

    async buscarPorId(id: number): Promise<Parqueadero | null> {
        if (this.hashMap.has(id)) return this.hashMap.get(id)!; // ← O(1) desde memoria
        const [rows]: any = await pool.execute(
            'SELECT * FROM parqueaderos WHERE id_parqueadero = ?',
            [id]
        );
        if (rows.length === 0) return null;
        const fila = rows[0];
        const parqueadero = new Parqueadero(fila.codigo, fila.zona, fila.tipo, fila.estado);
        parqueadero.idParqueadero = fila.id_parqueadero;
        this.hashMap.set(id, parqueadero); // ← guarda en cache
        return parqueadero;
    }

    async buscarLibres(): Promise<Parqueadero[]> {
        this.heap = new MinHeap();
        const [rows]: any = await pool.execute(
            'SELECT * FROM parqueaderos WHERE estado = ? AND activo = TRUE',
            ['libre']
        );
        return rows.map((fila: any) => {
            const parqueadero = new Parqueadero(fila.codigo, fila.zona, fila.tipo, fila.estado);
            parqueadero.idParqueadero = fila.id_parqueadero;
            this.heap.insertar(parqueadero);
            this.hashMap.set(parqueadero.idParqueadero!, parqueadero);
            return parqueadero;
        });
    }

    async obtenerEspacioOptimo(tipo: 'auto' | 'moto' | 'bicicleta' | 'discapacidad'): Promise<Parqueadero> {
        const libres = await this.buscarLibres();
        const delTipo = libres.filter((p) => p.tipo === tipo);

        if (delTipo.length === 0) {
            throw new Error('No hay espacios disponibles para ese tipo de vehículo');
        }

        this.heap = new MinHeap();
        delTipo.forEach((p) => this.heap.insertar(p));
        const optimo = this.heap.extraerMin();

        if (!optimo) {
            throw new Error('No hay espacios disponibles para ese tipo de vehículo');
        }

        return optimo;
    }

    async cambiarEstado(id: number, estado: 'libre' | 'ocupado' | 'reservado' | 'mantenimiento' | 'bloqueado'): Promise<void> {
        await pool.execute(
            'UPDATE parqueaderos SET estado = ? WHERE id_parqueadero = ?',
            [estado, id]
        );
        if (estado === 'ocupado') {
            this.heap.extraerMin();
        }
        const parqueadero = this.hashMap.get(id);
        if (parqueadero) {
            parqueadero.estado = estado;
            this.hashMap.set(id, parqueadero);
        }
        const fila = Math.floor((id - 1) / 10);
        const columna = (id - 1) % 10;
        this.matriz.actualizar(fila, columna, estado);
    }

    obtenerMatriz(): string[][] {
        return this.matriz.obtenerTodo();
    }

    async cargarMatrizDesdeBD(): Promise<string[][]> {
        const [rows]: any = await pool.execute(
            'SELECT id_parqueadero, estado FROM parqueaderos WHERE activo = TRUE'
        );

        if (rows.length === 0) {
            return [];
        }

        this.matriz = new Matriz2D(10, 10);
        for (const fila of rows) {
            const id = fila.id_parqueadero;
            const filaIdx = Math.floor((id - 1) / 10);
            const colIdx = (id - 1) % 10;
            this.matriz.actualizar(filaIdx, colIdx, fila.estado);
        }

        return this.matriz.obtenerTodo();
    }

    actualizarMatriz(fila: number, columna: number, estado: string): void {
        this.matriz.actualizar(fila, columna, estado);
    }
}