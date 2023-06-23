import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentModel } from 'src/app/models/document.model'; 
import { FileService } from 'src/app/services/file.service';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-manaules-guias',
  templateUrl: './manaules-guias.component.html',
  styleUrls: ['./manaules-guias.component.css']
})
export class ManaulesGuiasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort !: MatSort;

  // mostrar_columnas: string[] = ['fecha', 'area', 'nombre', 'url', 'download' ];
  mostrar_columnas: string[] = ['fecha', 'area', 'nombre', 'download' ];

  datosAuditoria = new MatTableDataSource<DocumentosAuditoria>(documentosAuditoria);
  datosCalidad = new MatTableDataSource<DocumentosCalidad>(documentosCalidad);
  datosComercial = new MatTableDataSource<DocumentosComercial>(documentosComercial);
  datosContabilidad = new MatTableDataSource<DocumentosContabilidad>(documentosContabilidad);
  datosImportaciones = new MatTableDataSource<DocumentosImportaciones>(documentosImportaciones);
  datosSig = new MatTableDataSource<DocumentosSig>(documentosSig);
  datosTalento_Humano = new MatTableDataSource<DocumentosTalento_Humano>(documentosTalento_Humano);
  datosTesoreria = new MatTableDataSource<DocumentosTesoreria>(documentosTesoreria);
  datosTi = new MatTableDataSource<DocumentosTi>(documentosTi);

  tablaSeleccionada: MatTableDataSource<any> = this.datosContabilidad;
  documento: DocumentModel = new DocumentModel ();
  // loading: boolean = false;
  // fechaInicio !: any;
  // fechaFin !: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: FileService, private http : HttpClient) {}

  ngOnInit() {
    this.service.getDocumentosPorAreaManuales('talento_humano').subscribe((documentos: DocumentosTalento_Humano[]) => {
      this.datosContabilidad.data = documentos;
      this.datosContabilidad.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.datosAuditoria.paginator = this.paginator;
    this.datosCalidad.paginator = this.paginator;
    this.datosComercial.paginator = this.paginator;
    this.datosContabilidad.paginator = this.paginator;
    this.datosImportaciones.paginator = this.paginator;
    this.datosSig.paginator = this.paginator;
    this.datosTalento_Humano.paginator = this.paginator;
    this.datosTesoreria.paginator = this.paginator;
    this.datosTi.paginator = this.paginator;
  }
             
  onChange(event: any) {
    switch (event.value) {
      case 'auditoria':
        this.tablaSeleccionada = this.datosAuditoria;
        this.service.getDocumentosPorAreaManuales('auditoria').subscribe((documentos: DocumentosAuditoria[]) => {
          this.tablaSeleccionada.data= documentos;
        });
        break;
        case 'calidad':
        this.tablaSeleccionada = this.datosCalidad;
        this.service.getDocumentosPorAreaManuales('calidad').subscribe((documentos: DocumentosCalidad[]) => {
          this.tablaSeleccionada.data= documentos;
        });
        break;
        case 'comercial':
        this.tablaSeleccionada = this.datosComercial;
        this.service.getDocumentosPorAreaManuales('comercial').subscribe((documentos: DocumentosComercial[]) => {
          this.tablaSeleccionada.data= documentos;
        });
        break;
      case 'contabilidad':
        this.tablaSeleccionada = this.datosContabilidad;
        this.service.getDocumentosPorAreaManuales('contabilidad').subscribe((documentos: DocumentosContabilidad[]) => {
          this.tablaSeleccionada.data= documentos;
        });
        break;
      case 'importaciones': 
        this.tablaSeleccionada = this.datosImportaciones;
        this.service.getDocumentosPorAreaManuales('importaciones').subscribe((documentos: DocumentosImportaciones[]) => {
          this.tablaSeleccionada.data= documentos;
        });
  
        break;
      case 'sig':
        this.tablaSeleccionada = this.datosSig;
        this.service.getDocumentosPorAreaManuales('sig').subscribe((documentos: DocumentosSig[]) => {
          this.tablaSeleccionada.data= documentos;
        });
        break;
      case 'talento_humano':
        this.tablaSeleccionada = this.datosTalento_Humano;
        this.service.getDocumentosPorAreaManuales('talento_humano').subscribe((documentos: DocumentosTalento_Humano[]) => {
          this.tablaSeleccionada.data= documentos;
        });
        break;
        case 'tesoreria':
          this.tablaSeleccionada = this.datosTesoreria;
          this.service.getDocumentosPorAreaManuales('tesoreria').subscribe((documentos: DocumentosTesoreria[]) => {
            this.tablaSeleccionada.data= documentos;
          });
          break;
          case 'ti':
            this.tablaSeleccionada = this.datosTi;
            this.service.getDocumentosPorAreaManuales('ti').subscribe((documentos: DocumentosTi[]) => {
              this.tablaSeleccionada.data= documentos;
            });
            break;
   /*    default:
        this.tablaSeleccionada = this.datosTH;
        this.service.getDocumentosPorArea('talento humano').subscribe((documentos: DocumentosTH[]) => {
          this.tablaSeleccionada.data= documentos;
        });
        break; */
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.tablaSeleccionada.filterPredicate = (data: any, filter: string) => data.nombre.trim().toLowerCase().indexOf(filter) !== -1;
    this.tablaSeleccionada.filter = filterValue;
    if (!filterValue) {
      this.tablaSeleccionada.filter = '';
    }
  }
  
  enviarInfo(form: NgForm){
    if(form.valid) {
      const documento: DocumentModel = {
        // id: form.value.id,
        nombre: form.value.nombre,
        fecha: form.value.fecha,
        area: form.value.area,
        url: form.value.url
      };
      this.service.addFormatos(documento).subscribe({
        next: (data:any)=>{
          console.log("informacion guardada en la base de datos");
        },
        error:(e)=> console.log("Error en el envio a la BD", e)
      });
    }
  }
  
  downloadFile(url: string, nombre: string): void {
    this.service.getNombreManuales(nombre).subscribe((documento: any) => {
      const nombreArchivo = documento[0].nombre;
      const urlArchivo = documento[0].url;
      console.log('Data Api :',documento);
      const urlParticionada = urlArchivo.substring(urlArchivo.indexOf("/documentos"));
      
      const extension = urlArchivo.substring(urlArchivo.lastIndexOf('.') + 1);
      const nombreCompleto = `${nombreArchivo}.${extension}`;

      this.http.get(`/api${urlParticionada}`, { responseType: 'blob' }).subscribe((archivo: any) => {
        const blob = new Blob([archivo]); 
        const link = document.createElement('a'); 
        link.href = window.URL.createObjectURL(blob); 
        link.download = nombreCompleto; 
        link.click();
      });
    });
  }
  
  ajustarAnchoInput(event: any) {
    const input = event.target;
    input.style.width = input.value.length + 'ch';
  }
} 

export interface DocumentosAuditoria{
  fecha: string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosAuditoria: DocumentosAuditoria[] = [];

export interface DocumentosCalidad{
  fecha: string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosCalidad: DocumentosCalidad[] = [];

export interface DocumentosComercial{
  fecha: string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosComercial: DocumentosComercial[] = [];

export interface DocumentosContabilidad {
  fecha : string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosContabilidad: DocumentosContabilidad[] = [];

export interface DocumentosImportaciones {
  fecha : string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosImportaciones: DocumentosImportaciones[] = [];

export interface DocumentosSig{
  fecha : string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosSig: DocumentosSig[] = [];

export interface DocumentosTalento_Humano {
  fecha: string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosTalento_Humano: DocumentosTalento_Humano[] = [];

export interface DocumentosTesoreria{
  fecha : string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosTesoreria: DocumentosTesoreria[] = [];

export interface DocumentosTi{
  fecha : string;
  nombre: string;
  area : string;
  url: string;
  download: string;
}

const documentosTi: DocumentosTi[] = [];

