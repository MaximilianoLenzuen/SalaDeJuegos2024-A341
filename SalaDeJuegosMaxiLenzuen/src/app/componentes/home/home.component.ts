import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any = null;
  
  volverAHome() {
    this.router.navigate(['/quiensoy']);
  }

  irAEncuesta() {
    this.router.navigate(['/encuesta']);
  }

  public nombreDelUsuario: string = '';

  constructor(private router: Router,private usuarioService: UsuarioService) {

  }

  ngOnInit(): void {
    this.nombreDelUsuario = this.eliminarDominioDeEmail(this.usuarioService.getMail());

    this.usuarioService.mail$.subscribe((mail: string) => {
      this.nombreDelUsuario = this.eliminarDominioDeEmail(mail);
    });
    this.usuarioService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(["/login"]);
      }
    });


  }

   eliminarDominioDeEmail(email : string) {
    const partes = email.split('@');
    if (partes.length === 2) {
      return "Bienvenido " + partes[0] + "!";
    } else {
      return email;
    }
  }

  async desloggearEvent() {
    try {
      if(await this.usuarioService.desloggearUsuario())
      {
        Swal.fire({
          icon: 'success',
          title: 'Hasta luego',
          text: '¡Adios!',
        }).then(() => {
          this.router.navigate(['/login']); 
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "error",
        })
      }
    } catch (error) {
      console.log(error);
    }
    }
}
  
  