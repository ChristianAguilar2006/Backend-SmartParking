
import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';
import { Parqueadero } from '../entities/parqueadero';

export class AsignarEspacioUseCase {
    constructor(private parqueaderoRepository: IParqueaderoRepository) {}

    async ejecutar(tipo: 'auto' | 'moto' | 'bicicleta' | 'discapacidad'): Promise<Parqueadero | null> {
        const libres = await this.parqueaderoRepository.buscarLibres();
        const delTipo = libres.filter(p => p.tipo === tipo);

        if (delTipo.length === 0) {
            throw new Error("No hay espacios disponibles para ese tipo de vehículo");
        }

        const optimo = delTipo[0];
        await this.parqueaderoRepository.cambiarEstado(optimo.idParqueadero!, 'ocupado');
        return optimo;
    }
}