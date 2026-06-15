
import { Log } from '../../domain/entities/log';

class NodoAVLLog {
    log: Log;
    altura: number;
    izquierda: NodoAVLLog | null;
    derecha: NodoAVLLog | null;

    constructor(log: Log) {
        this.log = log;
        this.altura = 1;
        this.izquierda = null;
        this.derecha = null;
    }
}

export class AVLEstadisticas {
    private raiz: NodoAVLLog | null = null;

    private altura(nodo: NodoAVLLog | null): number {
        return nodo ? nodo.altura : 0;
    }

    private balance(nodo: NodoAVLLog): number {
        return this.altura(nodo.izquierda) - this.altura(nodo.derecha);
    }

    private rotarDerecha(y: NodoAVLLog): NodoAVLLog {
        const x = y.izquierda!;
        y.izquierda = x.derecha;
        x.derecha = y;
        y.altura = Math.max(this.altura(y.izquierda), this.altura(y.derecha)) + 1;
        x.altura = Math.max(this.altura(x.izquierda), this.altura(x.derecha)) + 1;
        return x;
    }

    private rotarIzquierda(x: NodoAVLLog): NodoAVLLog {
        const y = x.derecha!;
        x.derecha = y.izquierda;
        y.izquierda = x;
        x.altura = Math.max(this.altura(x.izquierda), this.altura(x.derecha)) + 1;
        y.altura = Math.max(this.altura(y.izquierda), this.altura(y.derecha)) + 1;
        return y;
    }

    private insertar(nodo: NodoAVLLog | null, log: Log): NodoAVLLog {
        if (!nodo) return new NodoAVLLog(log);

        if (log.horaEntrada < nodo.log.horaEntrada) {
            nodo.izquierda = this.insertar(nodo.izquierda, log);
        } else {
            nodo.derecha = this.insertar(nodo.derecha, log);
        }

        nodo.altura = Math.max(this.altura(nodo.izquierda), this.altura(nodo.derecha)) + 1;
        const bal = this.balance(nodo);

        if (bal > 1 && log.horaEntrada < nodo.izquierda!.log.horaEntrada)
            return this.rotarDerecha(nodo);
        if (bal < -1 && log.horaEntrada > nodo.derecha!.log.horaEntrada)
            return this.rotarIzquierda(nodo);
        if (bal > 1 && log.horaEntrada > nodo.izquierda!.log.horaEntrada) {
            nodo.izquierda = this.rotarIzquierda(nodo.izquierda!);
            return this.rotarDerecha(nodo);
        }
        if (bal < -1 && log.horaEntrada < nodo.derecha!.log.horaEntrada) {
            nodo.derecha = this.rotarDerecha(nodo.derecha!);
            return this.rotarIzquierda(nodo);
        }

        return nodo;
    }

    agregar(log: Log): void {
        this.raiz = this.insertar(this.raiz, log);
    }

    buscarPorRango(inicio: Date, fin: Date): Log[] {
        const resultado: Log[] = [];
        this.inOrder(this.raiz, inicio, fin, resultado);
        return resultado;
    }

    private inOrder(nodo: NodoAVLLog | null, inicio: Date, fin: Date, resultado: Log[]): void {
        if (!nodo) return;
        this.inOrder(nodo.izquierda, inicio, fin, resultado);
        if (nodo.log.horaEntrada >= inicio && nodo.log.horaEntrada <= fin) {
            resultado.push(nodo.log);
        }
        this.inOrder(nodo.derecha, inicio, fin, resultado);
    }
}