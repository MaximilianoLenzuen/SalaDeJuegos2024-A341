import { inject,Injectable } from '@angular/core';
import { Auth,signInWithEmailAndPassword,createUserWithEmailAndPassword, authState } from '@angular/fire/auth';
import { Firestore,addDoc,collection,collectionData } from '@angular/fire/firestore';
import { RegistroResultado } from '../models/registro-resultado';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    private mailSubject = new BehaviorSubject<string>(localStorage.getItem('mail') || '');
    mail$ = this.mailSubject.asObservable();
    setMail(value: string) {
      localStorage.setItem('mail', value);
      this.mailSubject.next(value);
    }
  
    getMail(): string {
      return this.mailSubject.getValue();
    }

    user$: Observable<{ user: any; email: string | null }>; 
    
    private auth : Auth = inject(Auth);

    constructor(private firestore: Firestore){
      this.user$ = authState(this.auth);
    }

  public mail: string = "";

  public contraseña: string = "";

  async loginConFirebase(mail :string,contraseña:string): Promise<boolean> {
    try {
      this.mail=mail;
      this.contraseña = contraseña;
      this.setMail(mail);
      await signInWithEmailAndPassword(this.auth,this.mail, this.contraseña);
      this.publicarLoggeo(this.mail);
      return true;
    } catch (error) {
        console.log(error);
      return false;
    }
  }

  async registrarUsuario(mail: string, contraseña: string): Promise<RegistroResultado> {
    try {
      this.mail = mail;
      this.contraseña = contraseña;
      await createUserWithEmailAndPassword(this.auth, this.mail, this.contraseña);
      
      // Publicar el loggeo si el registro es exitoso
      this.publicarLoggeo(this.mail);
  
      return {
        pudoAcceder: true,
        mensaje: "Usuario registrado exitosamente"
      };
    } catch (error: any) {
      let mensajeError = "";
  
      // Definir mensaje de error personalizado basado en el código del error de Firebase
      switch (error.code) {
        case "auth/email-already-in-use":
          mensajeError = "Este correo ya está registrado.";
          break;
        case "auth/weak-password":
          mensajeError = "La contraseña debe tener más de 6 caracteres.";
          break;
        case "auth/invalid-email":
          mensajeError = "El correo electrónico es inválido.";
          break;
        default:
          mensajeError = "Error al registrar el usuario: " + error.message;
          break;
      }
  
      console.error("Error de registro:", error);
  
      return {
        pudoAcceder: false,
        mensaje: mensajeError
      };
    }
  }

  async desloggearUsuario(): Promise<boolean> {
    try {
      await this.auth.signOut();
      localStorage.removeItem('mail');  // Elimina el mail del localStorage
      this.mailSubject.next('');
      console.log('Usuario deslogueado con éxito');
      this.mail = '';
      this.contraseña = '';
      return true;
    } catch (error) {
      console.error('Error al desloguear:', error);
      return false;
    }
  }

  publicarLoggeo(email : string) {
    const col = collection(this.firestore, 'LogeoDeUsuarios');
    addDoc(col, {email,fechaYHora: new Date()});
  }

  publicarMensaje(mensaje : string) {
    const col = collection(this.firestore, 'mensajes');
    addDoc(col, {mensaje: mensaje ,usuario: this.getMail(), fechaYHora: new Date()});
  }

  publicarResultadoJuego(nombreJuego: string, resultado: any) {
    const col = collection(this.firestore, nombreJuego);
    addDoc(col, resultado);
  } // end of sendUserResult
  
}