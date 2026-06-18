"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVLTree = void 0;
class NodoAVL {
    constructor(reserva) {
        this.reserva = reserva;
        this.altura = 1;
        this.izquierda = null;
        this.derecha = null;
    }
}
class AVLTree {
    constructor() {
        this.raiz = null;
    }
    altura(nodo) {
        return nodo ? nodo.altura : 0;
    }
    balance(nodo) {
        return this.altura(nodo.izquierda) - this.altura(nodo.derecha);
    }
    rotarDerecha(y) {
        const x = y.izquierda;
        y.izquierda = x.derecha;
        x.derecha = y;
        y.altura = Math.max(this.altura(y.izquierda), this.altura(y.derecha)) + 1;
        x.altura = Math.max(this.altura(x.izquierda), this.altura(x.derecha)) + 1;
        return x;
    }
    rotarIzquierda(x) {
        const y = x.derecha;
        x.derecha = y.izquierda;
        y.izquierda = x;
        x.altura = Math.max(this.altura(x.izquierda), this.altura(x.derecha)) + 1;
        y.altura = Math.max(this.altura(y.izquierda), this.altura(y.derecha)) + 1;
        return y;
    }
    insertar(nodo, reserva) {
        if (!nodo)
            return new NodoAVL(reserva);
        if (reserva.horaInicio < nodo.reserva.horaInicio) {
            nodo.izquierda = this.insertar(nodo.izquierda, reserva);
        }
        else {
            nodo.derecha = this.insertar(nodo.derecha, reserva);
        }
        nodo.altura = Math.max(this.altura(nodo.izquierda), this.altura(nodo.derecha)) + 1;
        const bal = this.balance(nodo);
        if (bal > 1 && reserva.horaInicio < nodo.izquierda.reserva.horaInicio)
            return this.rotarDerecha(nodo);
        if (bal < -1 && reserva.horaInicio > nodo.derecha.reserva.horaInicio)
            return this.rotarIzquierda(nodo);
        if (bal > 1 && reserva.horaInicio > nodo.izquierda.reserva.horaInicio) {
            nodo.izquierda = this.rotarIzquierda(nodo.izquierda);
            return this.rotarDerecha(nodo);
        }
        if (bal < -1 && reserva.horaInicio < nodo.derecha.reserva.horaInicio) {
            nodo.derecha = this.rotarDerecha(nodo.derecha);
            return this.rotarIzquierda(nodo);
        }
        return nodo;
    }
    agregar(reserva) {
        this.raiz = this.insertar(this.raiz, reserva);
    }
    buscarPorFecha(fecha) {
        const resultado = [];
        this.inOrder(this.raiz, fecha, resultado);
        return resultado;
    }
    inOrder(nodo, fecha, resultado) {
        if (!nodo)
            return;
        this.inOrder(nodo.izquierda, fecha, resultado);
        if (nodo.reserva.fecha.toDateString() === fecha.toDateString()) {
            resultado.push(nodo.reserva);
        }
        this.inOrder(nodo.derecha, fecha, resultado);
    }
}
exports.AVLTree = AVLTree;
