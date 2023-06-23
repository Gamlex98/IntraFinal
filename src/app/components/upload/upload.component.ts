import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { DocumentModel } from 'src/app/models/document.model';
import { FileService } from 'src/app/services/file.service'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { logoModel } from 'src/app/models/logo.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})

export class UploadComponent {

  documento: DocumentModel = new DocumentModel ();

  direccion = {url: ""};
  rutaRelativa = "";
  total: number = 0;
  fileToUpload !: File;
  authenticated = false;
  authComponente = false;
  sid = '';
  porcentaje: number = 0;
  enviando: boolean = false;

  authorizedUser = 'Gamlex98';
  authorizedPassword = 'Hck9820';
  showModal = false;
  showComponent = false;

  constructor ( private service:FileService, private http:HttpClient ) { }

  authenticate() {
    const usuario = 'Intranet';
    const pass = 'MW50cjQxMjMrLSo=';

    this.service.authenticate(usuario, pass).subscribe(
      authSid => {
        this.authenticated = true;
        this.sid = authSid;
        console.log("SID generado: " + this.sid);
      },
      error => {
        console.error('Authentication failed', error);
      }
    );
  }

  /* selectedFile(event: any) {
    this.fileToUpload = event.target.files[0];
  } */

  onFileSelected(event: any) {
    const file: File = event.target?.files?.[0];
    this.total = file.size;
    const reader = new FileReader();
    const rutaBase = "http://172.16.1.24:88/";

    reader.onload = (e: any) => {
      this.direccion.url = rutaBase + this.rutaRelativa + file?.name;
      console.log("url completa : " + this.direccion.url);
    };
  
    reader.readAsDataURL(file);
  }

  onUpload() {
    const pruebaCarpeta = 'carpetaNull';
    const uploadUrl = `http://172.16.1.24:8095/cgi-bin/filemanager/utilRequest.cgi?func=upload&type=standard&sid=${this.sid}&dest_path=/Web/${this.rutaRelativa}&overwrite=1&progress=-Web`;

    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    console.log("nombre archivo : " + this.fileToUpload.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const checDir = `http://172.16.1.24:8095/cgi-bin/filemanager/utilRequest.cgi?func=get_tree&sid=${this.sid}&is_iso=1&node=/Web`;

    this.http.get(checDir).subscribe({
      next: (response) => {
        console.log(response);
        const existe = Object.values(response).filter((item: { name: string; type: string; }) => item.name === pruebaCarpeta && item.type === 'dir');
        if (existe.length === 0) {
          const createDir = `http://172.16.1.24:8095/cgi-bin/filemanager/utilRequest.cgi?func=createdir&type=standard&sid=${this.sid}&dest_folder=/Web/${pruebaCarpeta}&dest_path=/Web`;
          this.http.get(createDir).subscribe({
            next: () => {
              this.doUpload(uploadUrl, formData, headers);
            },
            error: (err) => {
              console.error('Error al crear la carpeta de destino', err);
            }
          });
        } else {
          this.doUpload(uploadUrl, formData, headers);
          console.log('Archivo subido , carpeta ya existia');
        }
      },
      error: (err) => {
        console.error('Error al verificar la carpeta de destino', err);
      }
    });
  }

  doUpload(uploadUrl: string, formData: FormData, headers: HttpHeaders) {
    this.http.post(uploadUrl, formData, { headers }).subscribe({
      next: (response) => {
        console.log('Upload successful', response);
      },
      error: (err) => {
        console.error('Upload failed', err);
      }
    });
  }
  
  enviarInfo(form: NgForm) {
    const tipo = form.value.tipo;
    const documento: DocumentModel = {
      tipo:form.value.tipo,
      nombre: form.value.nombre,
      fecha: form.value.fecha,
      area: form.value.area,
      url: form.value.url,
    } ;

    const logo: logoModel = {
      nombre: form.value.nombre,
      url: form.value.url
    } ;
    
    if(form.valid) {
      switch (tipo) {
        case 'documento':
          console.log('Tipo Select:',tipo);
          // Llamar al servicio addDocumentos
          this.service.addDocumentos(documento).subscribe({
            next: (data: any) => {
              console.log("informacion guardada en la base de datos");
              this.progressBar();
            },
            error: (e) => console.log(e)
          });
          break;
        case 'formato':
          // Llamar al servicio addFormatos
          this.service.addFormatos(documento).subscribe({
            next: (data: any) => {
              console.log("informacion guardada en la base de datos");
              this.progressBar();
            },
            error: (e) => console.log(e)
          });
          break;
        case 'manual':
          // Llamar al servicio addManuales
          this.service.addManuales(documento).subscribe({
            next: (data: any) => {
              console.log("informacion guardada en la base de datos");
              this.progressBar();
            },
            error: (e) => console.log(e)
          });
          break;

          case 'Logo':
          // Llamar al servicio addManuales
          this.service.addLogos(logo).subscribe({
            next: (data: any) => {
              console.log("informacion guardada en la base de datos");
              this.progressBar();
            },
            error: (e) => console.log(e)
          });
          break;
      }
      
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debes llenar los datos !!',
        showConfirmButton: false,
        timer: 1000
        });
    }
  }
  
  progressBar() {
    this.enviando = true;
    this.porcentaje = 0; // resetear el porcentaje
    let intervalo = setInterval(() => {
      if (this.porcentaje < 100) {
        this.porcentaje += 10;
      } else {
        clearInterval(intervalo);
        this.enviando = false;
      }
    }, 100);
  }
  
  onFolderSelected(event: any) {
    const value = event.target.value;
    this.rutaRelativa = value;
  }
  
  ajustarAnchoInput(event: any) {
    const input = event.target;
    input.style.width = input.value.length + 'ch';
  }
  
}


