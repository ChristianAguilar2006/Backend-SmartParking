import {LoginHistory} from '../../domain/repositories/IFallosLogin'

export class LoginHistoryManager extends LoginHistory {
    historial: { email: string, fecha: Date }[] = [];

    guardarIntento(email: string, fecha: Date){
        this.historial.push({ email, fecha });
    };

    obtenerIntentos(email: string): Date[] {
        return this.historial
            .filter(intento => intento.email === email)
            .map(intento => intento.fecha);
    }
}