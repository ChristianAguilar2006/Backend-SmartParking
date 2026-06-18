"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const ISessionManager_1 = require("../../domain/repositories/ISessionManager");
class TokenManager extends ISessionManager_1.SesionRepository {
    constructor() {
        super(...arguments);
        this.currentSesions = new Map();
    }
    guardar(token, usuario) {
        this.currentSesions.set(token, usuario);
    }
    buscarPorToken(token) {
        const user = this.currentSesions.get(token);
        return user ?? null;
    }
}
exports.TokenManager = TokenManager;
