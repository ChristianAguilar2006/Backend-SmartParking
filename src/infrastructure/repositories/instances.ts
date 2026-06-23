import { LoginHistoryManager } from './IntentosFallidosManager';
import { MysqlEstadisticasRepository } from './MysqlEstadisticasRepository';
import { MysqlLogRepository } from './MysqlLogRepository';
import { MysqlPagoRepository } from './MysqlPagoRepository';
import { MysqlParqueaderoRepository } from './MysqlParqueaderoRepository';
import { MysqlReservaRepository } from './MysqlReservaRepository';
import { UsuarioMySQL } from './MysqlUsuarioRepository';
import { TokenManager } from './SesionMemoria';

export const usuarioRepo = new UsuarioMySQL();
export const tokenManager = new TokenManager();
export const loginHistoryManager = new LoginHistoryManager();
export const parqueaderoRepo = new MysqlParqueaderoRepository();
export const reservaRepo = new MysqlReservaRepository();
export const pagoRepo = new MysqlPagoRepository();
export const logRepo = new MysqlLogRepository();
export const estadisticasRepo = new MysqlEstadisticasRepository();
