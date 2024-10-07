import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
  standalone: true,
  imports : [CommonModule]
})
export class AhorcadoComponent implements OnInit {
    user: any = null;
    disabledLetters: string[] = [];
    buttonLetters: string[] = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'Ñ',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
  
    victory: boolean = false;
    score: number = 0;
    activeGame: boolean = true;
    attempts: number = 6;
    image: number | any = 0;
    word: string = '';
    hyphenatedWord: string[] = [];
  
    listOfWords: string[] = [
      'ESMERALDA',
      'PERRO',
      'DIAMANTE',
      'DEMOCRACIA',
      'AVE',
      'PALOMA',
      'INVASOR',
      'AEREO',
      'SALSA',
      'CAOS',
      'TERRATENIENTE',
      'ESCALERA',
    ];
    
    constructor(
      private router: Router, private usuarioService : UsuarioService,private cdr: ChangeDetectorRef
    ) {
      this.word =
        this.listOfWords[
          Math.round(Math.random() * (this.listOfWords.length - 1))
        ];
      this.hyphenatedWord = Array(this.word.length).fill('_');
    }
  
    volverAHome() {
      this.router.navigate(['/home']);
    }
    
    ngOnInit(): void {
      this.usuarioService.user$.subscribe((user: any) => {
        if (user) {
          this.user = user;
        } else {
          this.router.navigate(["/login"]);
        }
      });
    }
  
    restartGame() {
      this.word =
        this.listOfWords[
          Math.round(Math.random() * (this.listOfWords.length - 1))
        ];
      this.hyphenatedWord = Array(this.word.length).fill('_');
      this.activeGame = true;
      this.attempts = 6;
      this.image = 0;
      this.victory = false;
      this.disabledLetters = [];
    } // end of restartGame

    isDisabled(letter: string): boolean {
      // Verifica si la letra está en el array de letras deshabilitadas
      return this.disabledLetters.includes(letter);
    }
  
    sendLetter(letter: string) {
      let letterFlag: boolean = false;
      let winGame: boolean = false;

      if (!this.disabledLetters.includes(letter)) {
        this.disabledLetters.push(letter);
        this.cdr.detectChanges();
      }
  
      if (this.activeGame) {
        const alreadyGuessedLetterFlag: boolean = this.hyphenatedWord.some(
          (c) => c === letter
        );
        for (let i = 0; i < this.word.length; i++) {
          const wordLetter = this.word[i];
          if (wordLetter === letter && !alreadyGuessedLetterFlag) {
            this.hyphenatedWord[i] = letter;
            letterFlag = true;
            winGame = this.hyphenatedWord.some((hyphen) => hyphen == '_');
            if (!winGame) {
              this.image = 'victoria';
              this.activeGame = false;
              this.victory = true;
              this.createResult();
              break;
            }
          }
        }
  
        if (!letterFlag && !alreadyGuessedLetterFlag) {
          if (this.attempts > 0) {
            this.attempts--;
            this.image++;
            if (this.attempts === 0) {
              this.activeGame = false;
              this.createResult();
            }
          }
        } else if (alreadyGuessedLetterFlag) {
        } else if (letterFlag) {
          if(!this.victory) {
          }
        }
      } else {
          
      }
    } 
  
    createResult() {
      let date = new Date();
      let currentDate = date.toLocaleDateString();
      let result = {
        juego: 'ahorcado',
        usuario: this.usuarioService.getMail(),
        fecha: currentDate,
        victoria: this.victory,
        intentosErrados: (6 - this.attempts)
      };
      this.usuarioService
        .publicarResultadoJuego('ahorcadoResultados', result);
    } 
}