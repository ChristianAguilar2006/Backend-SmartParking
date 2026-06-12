export abstract class LoginHistory {
    abstract guardarIntento(email: string, fecha: Date): void;
    abstract obtenerIntentos(email: string): Date[];
}