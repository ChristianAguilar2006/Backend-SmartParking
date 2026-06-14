import { Reserva } from '../../domain/entities/reserva';

class NodoAVL {
    reserva: Reserva;
    altura: number;
    izquierda: NodoAVL | null;
    derecha: NodoAVL | null;

    constructor(reserva: Reserva) {
        this.reserva = reserva;
        this.altura = 1;
        this.izquierda = null;
        this.derecha = null;
    }
}

export class AVLTree {
    private raiz: NodoAVL | null = null;

    private altura(nodo: NodoAVL | null): number {
        return nodo ? nodo.altura : 0;
    }

    private balance(nodo: NodoAVL): number {
        return this.altura(nodo.izquierda) - this.altura(nodo.derecha);
    }

    private rotarDerecha(y: NodoAVL): NodoAVL {
        const x = y.izquierda!;
        y.izquierda = x.derecha;
        x.derecha = y;
        y.altura = Math.max(this.altura(y.izquierda), this.altura(y.derecha)) + 1;
        x.altura = Math.max(this.altura(x.izquierda), this.altura(x.derecha)) + 1;
        return x;
    }

    private rotarIzquierda(x: NodoAVL): NodoAVL {
        const y = x.derecha!;
        x.derecha = y.izquierda;
        y.izquierda = x;
        x.altura = Math.max(this.altura(x.izquierda), this.altura(x.derecha)) + 1;
        y.altura = Math.max(this.altura(y.izquierda), this.altura(y.derecha)) + 1;
        return y;
    }

    private insertar(nodo: NodoAVL | null, reserva: Reserva): NodoAVL {
        if (!nodo) return new NodoAVL(reserva);

        if (reserva.horaInicio < nodo.reserva.horaInicio) {
            nodo.izquierda = this.insertar(nodo.izquierda, reserva);
        } else {
            nodo.derecha = this.insertar(nodo.derecha, reserva);
        }

        nodo.altura = Math.max(this.altura(nodo.izquierda), this.altura(nodo.derecha)) + 1;
        const bal = this.balance(nodo);

        if (bal > 1 && reserva.horaInicio < nodo.izquierda!.reserva.horaInicio)
            return this.rotarDerecha(nodo);
        if (bal < -1 && reserva.horaInicio > nodo.derecha!.reserva.horaInicio)
            return this.rotarIzquierda(nodo);
        if (bal > 1 && reserva.horaInicio > nodo.izquierda!.reserva.horaInicio) {
            nodo.izquierda = this.rotarIzquierda(nodo.izquierda!);
            return this.rotarDerecha(nodo);
        }
        if (bal < -1 && reserva.horaInicio < nodo.derecha!.reserva.horaInicio) {
            nodo.derecha = this.rotarDerecha(nodo.derecha!);
            return this.rotarIzquierda(nodo);
        }

        return nodo;
    }

    agregar(reserva: Reserva): void {
        this.raiz = this.insertar(this.raiz, reserva);
    }

    buscarPorFecha(fecha: Date): Reserva[] {
        const resultado: Reserva[] = [];
        this.inOrder(this.raiz, fecha, resultado);
        return resultado;
    }

    private inOrder(nodo: NodoAVL | null, fecha: Date, resultado: Reserva[]): void {
        if (!nodo) return;
        this.inOrder(nodo.izquierda, fecha, resultado);
        if (nodo.reserva.fecha.toDateString() === fecha.toDateString()) {
            resultado.push(nodo.reserva);
        }
        this.inOrder(nodo.derecha, fecha, resultado);
    }
}