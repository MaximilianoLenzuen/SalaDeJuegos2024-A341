import { Injectable } from '@angular/core';
import { Firestore,collection, collectionData, query,getDocs,orderBy,limit, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor(private firestore: Firestore) {}

  obtenerMensajesDelChat() : Observable<any>{
    const col = collection(this.firestore, 'mensajes');
    const querySorted = query(col, orderBy('fechaYHora', 'asc'), limit(30));
    
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(querySorted, (querySnapshot) => {
        const mensajesArray: { mensaje: any; fechaYHora: any; usuario: any; }[] = [];
        
        querySnapshot.forEach((doc) => {
          const mensaje = doc.data();
          const mensajeFormateado = {
            mensaje: mensaje['mensaje'],
            fechaYHora: this.convertDate(mensaje['fechaYHora']),
            usuario: mensaje['usuario'],
          };
          mensajesArray.push(mensajeFormateado);
        });
        observer.next(mensajesArray); // Emite los mensajes actualizados
      }, (error) => {
        observer.error(error); // Emite un error en caso de fallo
      });

      // Devuelve una función de limpieza para dejar de escuchar
      return () => unsubscribe();
    });
    }


    convertDate(fecha: any) {
        const date = new Date(fecha.seconds * 1000);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        const formattedDate = `${day}-${month}-${year} - ${hours}:${minutes}HS`;
        
        return formattedDate;
  }
}