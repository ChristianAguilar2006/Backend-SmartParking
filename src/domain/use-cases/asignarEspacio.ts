import { IParqueaderoRepository } from '../repositories/IParqueaderoRepository';
import { Parqueadero } from '../entities/parqueadero';

export class AsignarEspacioUseCase {
    constructor(private parqueaderoRepository: IParqueaderoRepository) {}

    async ejecutar(tipo: 'auto' | 'moto' | 'bicicleta' | 'discapacidad'): Promise<Parqueadero | null> {
        const optimo = await this.parqueaderoRepository.obtenerEspacioOptimo(tipo);
        await this.parqueaderoRepository.cambiarEstado(optimo.idParqueadero!, 'ocupado');
        return optimo;
    }
}
