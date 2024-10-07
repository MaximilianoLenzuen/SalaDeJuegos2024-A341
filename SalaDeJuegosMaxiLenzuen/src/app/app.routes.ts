import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { ErrorComponent } from './componentes/error/error.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { RegistrarseComponent } from './componentes/registrarse/registrarse.component';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './componentes/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './componentes/preguntados/preguntados.component';
import { DesactivarBombaComponent } from './componentes/desactivar-bomba/desactivar-bomba.component';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'quiensoy', component: QuienSoyComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'registrarse', component: RegistrarseComponent },
    { path: 'ahorcado', component: AhorcadoComponent },
    { path: 'mayormenor', component: MayorMenorComponent },
    { path: 'preguntados', component: PreguntadosComponent },
    { path: 'desactivar-bomba', component: DesactivarBombaComponent },
    { path: 'encuesta', component: EncuestaComponent },
    { path: 'home',
        loadChildren: () => import('./componentes/home/home.module')
        .then(mod => mod.HomeModule) },
    { path: '**', redirectTo: '/error' },

];
