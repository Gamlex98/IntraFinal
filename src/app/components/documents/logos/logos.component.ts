  import { HttpClient } from '@angular/common/http';
  import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
  import { logoModel } from 'src/app/models/logo.model';
  import { FileService } from 'src/app/services/file.service';

  @Component({
    selector: 'app-logos',
    templateUrl: './logos.component.html',
    styleUrls: ['./logos.component.css']
  })
  export class LogosComponent implements OnInit {

    logoUrl !: string;
    nombre !: string;

    constructor(private http: HttpClient , private service : FileService , private elementRef : ElementRef) {}

    ngOnInit() {
      this.getLogos();
    }

    getLogos () {
      this.service.getLogos().subscribe((logos:any) => {
        console.log('Logos :',logos);
        this.logoUrl = logos[0].url;
        this.nombre = logos[0].nombre;

        const contenedor = this.elementRef.nativeElement.querySelector('#mi-contenedor');
        this.showFile(this.logoUrl, contenedor);
      })
    }

    showFile(url: any, contenedor : any): void {

      const urlLogo = this.logoUrl;
      const urlParticionada = urlLogo.substring(this.logoUrl.indexOf("/logo"));
      this.http.get(`/api${urlParticionada}`, { responseType: 'blob' }).subscribe((archivo: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = document.createElement('img');
          img.src = reader.result as string;
          contenedor.appendChild(img);
        };
        reader.readAsDataURL(archivo);
      });
    }

    downloadFile(url: any): void {

      const extension = url.substring(url.lastIndexOf('.') + 1);
      const nombreCompleto = `${this.nombre}.${extension}`;    
      const urlParticionada = this.logoUrl.substring(this.logoUrl.indexOf("/logo"));

      console.log('Url partida :', urlParticionada);

      this.http.get(`/api${urlParticionada}`, { responseType: 'blob' }).subscribe((archivo: any) => {
        const blob = new Blob([archivo]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = nombreCompleto;
        link.click();
      });
    }
  }
