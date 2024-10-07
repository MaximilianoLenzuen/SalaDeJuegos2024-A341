import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-desactivar-bomba',
  templateUrl: './desactivar-bomba.component.html',
  styleUrls: ['./desactivar-bomba.component.scss'],
  standalone: true,
  imports:[CommonModule,FormsModule ],
})
export class DesactivarBombaComponent implements OnInit {
  startButtonText: string = 'Comenzar Juego';
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  esMayor: boolean = false;
  esMenor: boolean = false;
  textGameOver: string = '¡PERDISTE!';
  cardImage: string = '../../../assets/images/mayormenor/blanca.png';
  cardDerechaImage: string = 'juegobomba.jpg';
  score: number = 0;
  attempts: number = 0;
  currentCard: any = null;
  currentNumber: number = 0;
  currentIndex: number = 0;
  time: number = 0;
  codigoDesactivacionBomba : number = 0;
  interval: any;
  inputValue: number = 0;
  user: any = null;

  constructor(
    private router: Router, private usuarioService: UsuarioService
  ) {}
    ngOnInit(): void {
      this.usuarioService.user$.subscribe((user: any) => {
        if (user) {
          this.user = user;
        } else {
          this.router.navigate(["/login"]);
        }
      });
    }
    startTimer(): void {
      this.interval = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          this.createResult();
          clearInterval(this.interval);
          this.activeGame = false;
          this.gameOver = true;
          this.cardDerechaImage = `bombaExplotada1.jpg`;
        }
      }, 1000); // Cada segundo
    }

  startGame() {
    this.codigoDesactivacionBomba = Math.floor(Math.random() * 1001);
    this.time = 60;
    this.startTimer();
    this.attempts = 0;
    this.victory = false;
    this.activeGame = true;
    this.gameOver = false;
    this.textGameOver = '¡PERDISTE!';
    this.score = 0;
    this.currentIndex = 0;
    this.startButtonText = 'Reiniciar Juego';
    this.cardDerechaImage = `bombaSinExplotar1.jpg`;
    this.esMayor = false;
    this.esMenor = false;
  } // end startGame

  intentarDesactivarBomba() {
    console.log("Input del metodo intentar desactivar bomba: " , this.inputValue)
    console.log("Codigo de desactivacion: " , this.codigoDesactivacionBomba)
    if(this.inputValue === this.codigoDesactivacionBomba) {
      this.attempts ++;
      this.score = this.attempts;
      this.activeGame = false;
      this.gameOver = true;
      this.victory = true;
      this.textGameOver = '¡GANASTE!';
      this.createResult();
      clearInterval(this.interval);
      this.cardDerechaImage = `bombaDesactivada1.png`;

    } else if(this.inputValue < this.codigoDesactivacionBomba) {
      this.esMayor = false;
      this.esMenor = true;
      this.attempts++;
    } else {
      this.esMayor = true;
      this.esMenor = false;
      this.attempts++;
    }
  } // end of playMayorMenor

  createResult() {
    let date = new Date();
    let currentDate = date.toLocaleDateString();
    let result = {
      juego: 'desactivarBomba',
      usuario: this.usuarioService.getMail(),
      fecha: currentDate,
      victoria: this.victory,
      tiempoRestante: this.time
    };
    this.usuarioService
      .publicarResultadoJuego('desactivarBombaResultados', result);
  } // end of createResult

  volverAHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval); // Limpiar el intervalo al destruir el componente
  }
}