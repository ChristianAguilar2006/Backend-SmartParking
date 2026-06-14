import { Parqueadero } from '../../domain/entities/parqueadero';

export class MinHeap {
    private heap: Parqueadero[] = [];

    private indPadre(i: number): number { return Math.floor((i - 1) / 2); }
    private indIzquierda(i: number): number { return 2 * i + 1; }
    private indDerecha(i: number): number { return 2 * i + 2; }

    private intercambiar(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    insertar(parqueadero: Parqueadero): void {
        this.heap.push(parqueadero);
        this.heapifyUp(this.heap.length - 1);
    }

    private heapifyUp(i: number): void {
        while (i > 0 && this.heap[i].idParqueadero! < this.heap[this.indPadre(i)].idParqueadero!) {
            this.intercambiar(i, this.indPadre(i));
            i = this.indPadre( i );
        }
    }

    extraerMin(): Parqueadero | null {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    private heapifyDown(i: number): void {
        let menor = i;
        const izq = this.indIzquierda(i);
        const der = this.indDerecha(i);

        if (izq < this.heap.length && this.heap[izq].idParqueadero! < this.heap[menor].idParqueadero!)
            menor = izq;
        if (der < this.heap.length && this.heap[der].idParqueadero! < this.heap[menor].idParqueadero!)
            menor = der;

        if (menor !== i) {
            this.intercambiar(i, menor);
            this.heapifyDown(menor);
        }
    }

    tamanio(): number { return this.heap.length; }
}