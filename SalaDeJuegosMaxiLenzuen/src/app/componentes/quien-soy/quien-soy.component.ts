import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.scss'
})
export class QuienSoyComponent {

  
  constructor(
    private router: Router
  ) {}

  navitageLogin(): void {
    this.router.navigate(["/login"]);
  }
}
