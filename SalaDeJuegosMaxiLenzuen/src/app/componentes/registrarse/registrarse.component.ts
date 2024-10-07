import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.scss'
})
export class RegistrarseComponent {

  email: string = "";
  contrasenia: string = "";

  constructor(private router: Router, private usuarioService: UsuarioService) {}
  
  async registrarse() {
    this.usuarioService.mail = this.email;
    this.usuarioService.contraseña = this.contrasenia;
  
    // Llama al método registrarUsuario y obtén el objeto de resultado
    const resultado = await this.usuarioService.registrarUsuario(this.usuarioService.mail, this.usuarioService.contraseña);
  
    if (resultado.pudoAcceder) {
      Swal.fire({
        icon: 'success',
        title: 'Usuario creado con éxito',
        text: 'Bienvenido!',
      }).then(() => {
        this.router.navigate(['/home']); // Redirige al home si el registro fue exitoso
      });
    } else {
      // Si no pudo acceder, muestra el mensaje de error devuelto por el servicio
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la cuenta',
        text: resultado.mensaje, // Aquí se usa el mensaje devuelto
      });
    }
  }
  
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
