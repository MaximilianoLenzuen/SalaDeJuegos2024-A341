import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss'],
  standalone: true,
  imports:[CommonModule],
})
export class PreguntadosComponent implements OnInit {
  user: any = null;
  listOfCountries: any = [];
  listOfQuestions: any = [];
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  gameOverText: string = '¡PERDISTE!';
  score: number = 0;
  attempts: number = 10;
  currentQuestion: any = null;
  loadedQuestions: boolean = false;
  currentIndex: number = 0;
  correctAnswer: boolean = false;
  wrongAnswer: boolean = false;

  constructor(
    private router: Router, private usuarioService: UsuarioService
  ) {
    this.getPaises();
  }

  ngOnInit(): void {
    this.usuarioService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
    this.getPaises().then((paises) => {
        this.listOfCountries = paises.map((country: any) => {
          return {
            name: country.translations.spa.official,
            flag: country.flags.png,
          };
        });
        this.startGame();
      }).catch(error => {
        console.log(error);
      });
  } // end of ngOnInit

  startGame() {
    this.generateQuestions();
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    this.activeGame = true;

  } // end of startGame

  generateQuestions() {
    this.listOfCountries.sort(() => Math.random() - 0.5);
    this.listOfQuestions = this.listOfCountries
      .slice(0, 10)
      .map((country: any) => {
        const option2 = this.listOfCountries[this.generateRandomNumber()].name;
        const option3 = this.listOfCountries[this.generateRandomNumber()].name;
        const option4 = this.listOfCountries[this.generateRandomNumber()].name;
        const options = [country.name, option2, option3, option4].sort(
          () => Math.random() - 0.5
        );
        return {
          answer: country.name,
          options: options,
          flag: country.flag,
        };
      });
    this.loadedQuestions = true;
  } // end of generateQuestions

  generateRandomNumber() {
    return Math.floor(Math.random() * 249);
  } // end of generateRandomNumber

  play(option: string, event: Event) {
    if (this.activeGame) {
      const btn = <HTMLButtonElement>event.target;
      btn.disabled = true;
      if (option === this.currentQuestion.answer) {
        this.score++;
        this.correctAnswer = true;
        setTimeout(() => {
          this.correctAnswer = false;
        }, 300);
      } else {
        this.wrongAnswer = true;
        setTimeout(() => {
          this.wrongAnswer = false;
        }, 300);
        Swal.fire({
            icon: 'error',
            title: 'No adivinaste',
            text: "La respuesta era: " + this.currentQuestion.answer, // Aquí se usa el mensaje devuelto
          });
      }

      if (this.currentIndex < 9) {
        this.currentIndex++;
        setTimeout(() => {
          this.currentQuestion = this.listOfQuestions[this.currentIndex];
        }, 500);
      }

      if (this.attempts > 0) {
        this.attempts--;
        if (this.attempts === 0) {
          this.activeGame = false;
          this.gameOver = true;
          if (this.score >= 4) {
            this.victory = true;
            this.gameOverText = '¡GANASTE!';
            Swal.fire({
                icon: 'success',
                title: 'GANASTE!!!',
                text: "Felicitaciones, ganaste", // Aquí se usa el mensaje devuelto
              });
          } else {
            Swal.fire({
                icon: 'error',
                title: 'PERDISTE!!!',
                text: "Vuelva a intentarlo", // Aquí se usa el mensaje devuelto
              });
          }
          this.createResult();
        }
      }
    }
  } // end of play

  restartGame() {
    this.generateQuestions();
    this.currentIndex = 0;
    this.score = 0;
    this.attempts = 10;
    this.activeGame = true;
    this.victory = false;
    this.gameOver = false;
    this.gameOverText = '¡PERDISTE!';
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    Swal.fire({
        icon: 'success',
        title: 'Preguntados',
        text: "Juego Reiniciado", // Aquí se usa el mensaje devuelto
      });
  } // end of restartGame

  createResult() {
    let date = new Date();
    let currentDate = date.toLocaleDateString();
    let result = {
      juego: 'preguntados',
      usuario: this.usuarioService.getMail(),
      fecha: currentDate,
      victoria: this.victory,
      puntuatcion: this.score
    };
    this.usuarioService
      .publicarResultadoJuego('preguntadosResultados', result);
  } // end of createResult

  async getPaises() {
    try {
      const response: any = await fetch('https://restcountries.com/v3.1/all');
      const paises: any = await response.json();
      return paises;
    } catch (error) {
      console.log(error);
    }
  }
  volverAHome() {
    this.router.navigate(['/home']);
  }
}