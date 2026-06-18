"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matriz2D = void 0;
class Matriz2D {
    constructor(filas, columnas) {
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = Array.from({ length: filas }, () => Array(columnas).fill('vacio'));
    }
    actualizar(fila, columna, estado) {
        if (fila >= this.filas || columna >= this.columnas) {
            throw new Error("Coordenadas fuera de rango");
        }
        this.matriz[fila][columna] = estado;
    }
    obtener(fila, columna) {
        return this.matriz[fila][columna];
    }
    obtenerTodo() {
        return this.matriz;
    }
}
exports.Matriz2D = Matriz2D;
