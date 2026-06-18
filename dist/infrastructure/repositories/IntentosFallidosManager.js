"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHistoryManager = void 0;
const IFallosLogin_1 = require("../../domain/repositories/IFallosLogin");
class LoginHistoryManager extends IFallosLogin_1.LoginHistory {
    constructor() {
        super(...arguments);
        this.historial = [];
    }
    guardarIntento(email, fecha) {
        this.historial.push({ email, fecha });
    }
    ;
    obtenerIntentos(email) {
        return this.historial
            .filter(intento => intento.email === email)
            .map(intento => intento.fecha);
    }
}
exports.LoginHistoryManager = LoginHistoryManager;
