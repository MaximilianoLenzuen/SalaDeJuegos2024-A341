import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { MensajesService } from '../../services/mensajes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone:true,
  imports: [FormsModule,CommonModule]
})
export class ChatComponent implements OnInit{

  @ViewChild('contenedorMensajes') private contenedorMensajes!: ElementRef;

  listaDeMensajes : any = [];
  usuarioActual : string = '';
  mensajeAEnviar : string = '';

  constructor(private mensajesService: MensajesService, private userService : UsuarioService, private router: Router) {
    this.mensajesService.obtenerMensajesDelChat().subscribe(
      (mensajes) => {
        this.listaDeMensajes = mensajes; // Actualiza los mensajes en tiempo real
      },
      (error) => {
        console.error('Error al obtener mensajes del chat:', error);
      }
    );
  }

  async ngOnInit() {
    try {
      this.listaDeMensajes = await this.mensajesService.obtenerMensajesDelChat();

    } catch (error) {
      console.error('Error al obtener mensajes:', error);
    }
    this.usuarioActual = this.userService.getMail();
  }

  async publicarMensajeEnChat() {
    if (!this.mensajeAEnviar.trim()) {
      return;
    }
    this.userService.publicarMensaje(this.mensajeAEnviar);
    this.listaDeMensajes = await this.mensajesService.obtenerMensajesDelChat();
    this.mensajeAEnviar = '';
    this.scrollToBottom();
  }

  private scrollToBottom() {
    const contenedor = this.contenedorMensajes.nativeElement;
    contenedor.scrollTop = contenedor.scrollHeight;
  }

    
  volverAHome() {
    this.router.navigate(['/quien-soy']);
  }

}