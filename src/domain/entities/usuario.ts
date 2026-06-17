export class Usuario {
    idUsuario?: number;
    idRol: number;
    email: string;
    passwordHash!: string;
    nombre: string;
    activo: boolean = false;

    constructor(idRol: number, email: string, nombre: string){
        this.idRol = idRol;
        this.email = email;
        this.nombre = nombre;
    }

    validarContrasenia(contraseña: string): void {
        const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (contraseña.length < 5) {
            throw new Error("Contraseña insegura debe tener mas de 5 caracteres");
        } else if (!regex.test(contraseña)) {
            throw new Error("Contraseña insegura debe contener almenos un caracter especial");
        }
        this.passwordHash = contraseña;
    }

    validarEmail(email: string): void {
        const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)){
            throw new Error("Error mal formato de email");
        }
    }
}