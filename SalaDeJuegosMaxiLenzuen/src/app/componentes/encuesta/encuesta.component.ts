import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
  standalone: true,
  imports : [CommonModule,ReactiveFormsModule]
})
export class EncuestaComponent implements OnInit {
  user: any = null;
  surveyForm: FormGroup;
  validOption: string | boolean;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {
    this.validOption = false;
    this.surveyForm = this.formBuilder.group({
      nombre: ['', [Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s]*$')]],
      apellido: ['', [Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s]*$')]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      gustoEstetica: [true],
      gustoJugabilidad: [false],
      gustoPerformance: [false],
      juegoFavorito: ['ahorcado'],
      recomiendaPagina: ['', [Validators.required]],
    });
  } // end of constructor

  ngOnInit(): void {
    this.usuarioService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  } // end of ngOnInit

  sendForm() {
    if (this.surveyForm.valid) {
      if (this.validateNewGame()) {
        this.createSurveyForm();
        this.surveyForm.reset({
          nombre: '',
          apellido: '',
          edad: '',
          telefono: '',
          nuevoJuegoTateti: true,
          nuevoJuegoMemotest: false,
          nuevoJuegoPPT: false,
          juegoFavorito: 'ahorcado',
          recomiendaPagina: '',
        });
      } else {
        this.showNewGameValidationMessage();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ingrese todos los datos',
          timer: 1000, 
          showConfirmButton: false,
          allowOutsideClick: false,
        });
        
      }
    } else {
      this.showNewGameValidationMessage();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingrese todos los datos',
        timer: 1500, 
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    }
  } // end of sendForm

  showNewGameValidationMessage() {
    const estetica = this.surveyForm.value.gustoEstetica;
    const jugabilidad = this.surveyForm.value.gustoJugabilidad;
    const performance = this.surveyForm.value.gustoPerformance;
    if (!estetica && !jugabilidad && !performance) {
      this.validOption = 'Se debe elegir al menos una opción';
    } else {
      this.validOption = false;
    }
  } // end of showNewGameValidationMessage

  volverAHome() {
    this.router.navigate(['/home']);
  }

  validateNewGame(): boolean {
    const estetica = this.surveyForm.value.gustoEstetica;
    const jugabilidad = this.surveyForm.value.gustoJugabilidad;
    const performance = this.surveyForm.value.gustoPerformance;
    if (!estetica && !jugabilidad && !performance) {
      return false;
    }
    return true;
  } // end of validateNewGame

  createSurveyForm() {
    const date = new Date();
    const currentDate = date.toLocaleDateString();
    const survey = {
      tipo: 'encuesta',
      user: this.usuarioService.getMail(),
      fecha: currentDate,
      resultadosEncuesta: this.surveyForm.value,
    };
    this.usuarioService
      .publicarResultadoJuego('encuestas', survey);
      Swal.fire({
        icon: 'success',
        title: 'Encuesta',
        text: 'Encuesta enviada',
      }).then(() => {
        this.router.navigate(['/home']); 
      });

  } // end of createSurveyForm
}