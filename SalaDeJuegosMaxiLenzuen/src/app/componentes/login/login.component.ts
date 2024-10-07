import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  user: any;
  email: string = "";
  contrasenia: string = "";

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        this.router.navigate(['/home']); 
      }
    });
  }
  
  async loguear() {
    this.usuarioService.mail = this.email;
    this.usuarioService.contraseña = this.contrasenia;
  
    try {
      const loginExitoso = await this.usuarioService.loginConFirebase(this.email, this.contrasenia);
      if (loginExitoso) {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: '¡Bienvenido!',
          timer: 1500, 
          showConfirmButton: false,
          allowOutsideClick: false,
        }).then(() => {
          this.router.navigate(['/home']); 
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error: Las credenciales no son correctas.',
          text: "Mail o contraseña incorrecta",
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado en el inicio de sesión',
        text: "Error inesperado",
      })
    }
  }

  accesoRapido1() {
    this.email = 'pepe@gmail.com';
    this.contrasenia = '123456';
  }

  accesoRapido2() {
    this.email = 'jose@gmail.com';
    this.contrasenia = '123456';
  }

  registrarse() {
    this.router.navigate(["/registrarse"]);
  }

  redirectToQuiensoy() {
    this.router.navigate(['/quiensoy']);
  }

}
