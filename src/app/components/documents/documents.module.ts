import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { PlantillasComponent } from './plantillas/plantillas.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { LogosComponent } from './logos/logos.component';
import { ManaulesGuiasComponent } from './manaules-guias/manaules-guias.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ImageModule } from 'primeng/image';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    DocumentsComponent,
    DocumentosComponent,
    PlantillasComponent,
    LogosComponent,
    ManaulesGuiasComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ImageModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class DocumentModule { }