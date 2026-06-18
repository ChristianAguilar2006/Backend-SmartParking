"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinHeap = void 0;
class MinHeap {
    constructor() {
        this.heap = [];
    }
    indPadre(i) { return Math.floor((i - 1) / 2); }
    indIzquierda(i) { return 2 * i + 1; }
    indDerecha(i) { return 2 * i + 2; }
    intercambiar(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    insertar(parqueadero) {
        this.heap.push(parqueadero);
        this.heapifyUp(this.heap.length - 1);
    }
    heapifyUp(i) {
        while (i > 0 && this.heap[i].idParqueadero < this.heap[this.indPadre(i)].idParqueadero) {
            this.intercambiar(i, this.indPadre(i));
            i = this.indPadre(i);
        }
    }
    extraerMin() {
        if (this.heap.length === 0)
            return null;
        const min = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    heapifyDown(i) {
        let menor = i;
        const izq = this.indIzquierda(i);
        const der = this.indDerecha(i);
        if (izq < this.heap.length && this.heap[izq].idParqueadero < this.heap[menor].idParqueadero)
            menor = izq;
        if (der < this.heap.length && this.heap[der].idParqueadero < this.heap[menor].idParqueadero)
            menor = der;
        if (menor !== i) {
            this.intercambiar(i, menor);
            this.heapifyDown(menor);
        }
    }
    tamanio() { return this.heap.length; }
}
exports.MinHeap = MinHeap;
