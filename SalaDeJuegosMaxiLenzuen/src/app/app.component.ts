import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./componentes/login/login.component";
import { ErrorComponent } from "./componentes/error/error.component";
import { HomeModule } from './componentes/home/home.module';
import { RegistrarseComponent } from './componentes/registrarse/registrarse.component';
import { ChatComponent } from './componentes/chat/chat-component';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, ErrorComponent, HomeModule, RegistrarseComponent, AhorcadoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Labo4';
}
