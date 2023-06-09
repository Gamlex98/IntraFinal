import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { UploadComponent } from './components/upload/upload.component';

const routes: Routes = [
  {path: '', redirectTo: 'home',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {
    path:'documentos',
    loadChildren: () => import('./components/documents/documents.module').then(m => m.DocumentModule)
  },
  {path: 'upload', component: UploadComponent},
  {path: 'calendario', component: CalendarioComponent},
  {path: 'solicitudes', component: SolicitudesComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
