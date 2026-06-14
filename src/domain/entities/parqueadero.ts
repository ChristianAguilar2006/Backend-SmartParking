export class Parqueadero {
    idParqueadero?: number;
    codigo: string;
    zona: string;
    tipo: 'auto' | 'moto' | 'bicicleta' | 'discapacidad';
    estado: 'libre' | 'ocupado' | 'reservado' | 'mantenimiento' | 'bloqueado';

    constructor(
        codigo: string,
        zona: string,
        tipo: 'auto' | 'moto' | 'bicicleta' | 'discapacidad',
        estado: 'libre' | 'ocupado' | 'reservado' | 'mantenimiento' | 'bloqueado' = 'libre'
    ) {
        this.codigo = codigo;
        this.zona = zona;
        this.tipo = tipo;
        this.estado = estado;
    }

    estaDisponible(): boolean {
        return this.estado === 'libre';
    }
}