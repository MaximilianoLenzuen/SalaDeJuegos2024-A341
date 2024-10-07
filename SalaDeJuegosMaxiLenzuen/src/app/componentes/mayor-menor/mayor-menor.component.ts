import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss'],
  standalone: true,
  imports:[CommonModule],
})
export class MayorMenorComponent implements OnInit {
  user: any = null;
  resultadoMensaje: string = '';
  resultadoColor: string = '';
  startButtonText: string = 'Comenzar Juego';
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  textGameOver: string = '¡PERDISTE!';
  cardImage: string = '../../../assets/images/mayormenor/blanca.png';
  cardDerechaImage: string = 'reverso';
  cardList: any = [
    { type: 'trebol', number: 1 },
    { type: 'trebol', number: 2 },
    { type: 'trebol', number: 3 },
    { type: 'trebol', number: 4 },
    { type: 'trebol', number: 5 },
    { type: 'trebol', number: 6 },
    { type: 'trebol', number: 7 },
    { type: 'trebol', number: 8 },
    { type: 'trebol', number: 9 },
    { type: 'trebol', number: 10 },
    { type: 'trebol', number: 11 },
    { type: 'trebol', number: 12 },
    { type: 'trebol', number: 13 },
    { type: 'diamante', number: 1 },
    { type: 'diamante', number: 2 },
    { type: 'diamante', number: 3 },
    { type: 'diamante', number: 4 },
    { type: 'diamante', number: 5 },
    { type: 'diamante', number: 6 },
    { type: 'diamante', number: 7 },
    { type: 'diamante', number: 8 },
    { type: 'diamante', number: 9 },
    { type: 'diamante', number: 10 },
    { type: 'diamante', number: 11 },
    { type: 'diamante', number: 12 },
    { type: 'diamante', number: 13 },
    { type: 'corazon', number: 1 },
    { type: 'corazon', number: 2 },
    { type: 'corazon', number: 3 },
    { type: 'corazon', number: 4 },
    { type: 'corazon', number: 5 },
    { type: 'corazon', number: 6 },
    { type: 'corazon', number: 7 },
    { type: 'corazon', number: 8 },
    { type: 'corazon', number: 9 },
    { type: 'corazon', number: 10 },
    { type: 'corazon', number: 11 },
    { type: 'corazon', number: 12 },
    { type: 'corazon', number: 13 },
    { type: 'pica', number: 1 },
    { type: 'pica', number: 2 },
    { type: 'pica', number: 3 },
    { type: 'pica', number: 4 },
    { type: 'pica', number: 5 },
    { type: 'pica', number: 6 },
    { type: 'pica', number: 7 },
    { type: 'pica', number: 8 },
    { type: 'pica', number: 9 },
    { type: 'pica', number: 10 },
    { type: 'pica', number: 11 },
    { type: 'pica', number: 12 },
    { type: 'pica', number: 13 },
  ];
  cardsToGuess: any = [];
  score: number = 0;
  attempts: number = 9;
  currentCard: any = null;
  currentNumber: number = 0;
  currentIndex: number = 0;

  constructor(
    private router: Router, private usuarioService : UsuarioService
  ) {}
    ngOnInit(): void {
      this.usuarioService.user$.subscribe((user: any) => {
        if (user) {
          this.user = user;
        } else {
          this.router.navigate(['/login']);
        }
      });
    }

  startGame() {
    this.attempts = 9;
    this.victory = false;
    this.activeGame = true;
    this.gameOver = false;
    this.textGameOver = '¡PERDISTE!';
    this.score = 0;
    this.currentIndex = 0;
    this.startButtonText = 'Reiniciar Juego';
    this.cardList.sort(() => Math.random() - 0.5);
    this.cardsToGuess = this.cardList.slice(0, 10);
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardImage = `../../../assets/images/mayormenor/${this.currentCard.type}_${this.currentCard.number}.png`;
    this.cardDerechaImage = `reverso`;
  } // end startGame

  playMayorMenor(mayorMenor: string) {
    const numeroCartaMostrada: number = this.currentNumber;
    this.currentIndex++;
    this.attempts--;
    this.currentCard = this.cardsToGuess[this.currentIndex];
    this.currentNumber = this.currentCard.number;
    this.cardDerechaImage = `${this.currentCard.type}_${this.currentCard.number}`;

    setTimeout(() => {
      this.cardImage = `../../../assets/images/mayormenor/${this.currentCard.type}_${this.currentCard.number}.png`;
      this.cardDerechaImage = `reverso`;
    }, 1500);
  

    switch (mayorMenor) {
      case 'menor':
        if (numeroCartaMostrada > this.currentNumber) {
          this.score++;
          this.resultadoMensaje = 'Correcto';
          this.resultadoColor = 'green';
          setTimeout(() => {
            this.resultadoMensaje = '';
            this.resultadoColor = '';
          }, 1500);
        } else if (numeroCartaMostrada === this.currentNumber) {
          this.resultadoMensaje = 'Empate';
          this.resultadoColor = 'yellow';
          setTimeout(() => {
            this.resultadoMensaje = '';
            this.resultadoColor = '';
          }, 1500);
        } else {
          this.resultadoMensaje = 'Incorrecto';
          this.resultadoColor = 'red';
          setTimeout(() => {
            this.resultadoMensaje = '';
            this.resultadoColor = '';
          }, 1500);
        }
        break;
      case 'mayor':
        if (numeroCartaMostrada < this.currentNumber) {
          this.score++;
          this.resultadoMensaje = 'Correcto';
          this.resultadoColor = 'green';
          setTimeout(() => {
            this.resultadoMensaje = '';
            this.resultadoColor = '';
          }, 1500);
        } else if (numeroCartaMostrada === this.currentNumber) {
          this.resultadoMensaje = 'Empate';
          this.resultadoColor = 'yellow';
          setTimeout(() => {
            this.resultadoMensaje = '';
            this.resultadoColor = '';
          }, 1500);
        } else {
          this.resultadoMensaje = 'Incorrecto';
          this.resultadoColor = 'red';
          setTimeout(() => {
            this.resultadoMensaje = '';
            this.resultadoColor = '';
          }, 1500);
        }
        break;
    }

    if (this.currentIndex === 9) {
      this.activeGame = false;
      this.gameOver = true;
      if (this.score >= 5) {
        this.victory = true;
        this.textGameOver = '¡GANASTE!';
        Swal.fire({
            icon: 'success',
            title: 'Ganador!',
            text: 'Ganaste!!!!!!!!!',
          });
      } else {
        Swal.fire({
            icon: 'error',
            title: 'Perdiste!',
            text: 'Perdiste!!!!!',
          });
      }
      this.createResult();
    }
  } // end of playMayorMenor

  volverAHome() {
    this.router.navigate(['/home']);
  }

  createResult() {
    let date = new Date();
    let currentDate = date.toLocaleDateString();
    let result = {
      juego: 'mayorMenor',
      usuario: this.usuarioService.getMail(),
      fecha: currentDate,
      victoria: this.victory,
      puntuatcion: this.score
    };
    this.usuarioService
      .publicarResultadoJuego('mayorMenorResultados', result);
  } // end of createResult
}