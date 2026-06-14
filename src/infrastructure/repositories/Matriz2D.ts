export class Matriz2D {
    private matriz: string[][];
    private filas: number;
    private columnas: number;

    constructor(filas: number, columnas: number) {
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = Array.from({ length: filas }, () => Array(columnas).fill('libre'));
    }

    actualizar(fila: number, columna: number, estado: string): void {
        if (fila >= this.filas || columna >= this.columnas) {
            throw new Error("Coordenadas fuera de rango");
        }
        this.matriz[fila][columna] = estado;
    }

    obtener(fila: number, columna: number): string {
        return this.matriz[fila][columna];
    }

    obtenerTodo(): string[][] {
        return this.matriz;
    }
}