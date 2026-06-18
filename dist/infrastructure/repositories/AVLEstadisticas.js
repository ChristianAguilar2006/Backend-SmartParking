"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVLEstadisticas = void 0;
class NodoAVLLog {
    constructor(log) {
        this.log = log;
        this.altura = 1;
        this.izquierda = null;
        this.derecha = null;
    }
}
class AVLEstadisticas {
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
    insertar(nodo, log) {
        if (!nodo)
            return new NodoAVLLog(log);
        if (log.horaEntrada < nodo.log.horaEntrada) {
            nodo.izquierda = this.insertar(nodo.izquierda, log);
        }
        else {
            nodo.derecha = this.insertar(nodo.derecha, log);
        }
        nodo.altura = Math.max(this.altura(nodo.izquierda), this.altura(nodo.derecha)) + 1;
        const bal = this.balance(nodo);
        if (bal > 1 && log.horaEntrada < nodo.izquierda.log.horaEntrada)
            return this.rotarDerecha(nodo);
        if (bal < -1 && log.horaEntrada > nodo.derecha.log.horaEntrada)
            return this.rotarIzquierda(nodo);
        if (bal > 1 && log.horaEntrada > nodo.izquierda.log.horaEntrada) {
            nodo.izquierda = this.rotarIzquierda(nodo.izquierda);
            return this.rotarDerecha(nodo);
        }
        if (bal < -1 && log.horaEntrada < nodo.derecha.log.horaEntrada) {
            nodo.derecha = this.rotarDerecha(nodo.derecha);
            return this.rotarIzquierda(nodo);
        }
        return nodo;
    }
    agregar(log) {
        this.raiz = this.insertar(this.raiz, log);
    }
    buscarPorRango(inicio, fin) {
        const resultado = [];
        this.inOrder(this.raiz, inicio, fin, resultado);
        return resultado;
    }
    inOrder(nodo, inicio, fin, resultado) {
        if (!nodo)
            return;
        this.inOrder(nodo.izquierda, inicio, fin, resultado);
        if (nodo.log.horaEntrada >= inicio && nodo.log.horaEntrada <= fin) {
            resultado.push(nodo.log);
        }
        this.inOrder(nodo.derecha, inicio, fin, resultado);
    }
}
exports.AVLEstadisticas = AVLEstadisticas;
