import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit{
  @Input() fechaSeleccionada!: string;

  fechaFin !: string;
  fechaInicial !: string;
  fechaInicialDate !: Date;
  tituloEvento !: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
  // console.log('FechaModal:', this.fechaSeleccionada);
  
    // Convertir fechaSeleccionada a un objeto Date
    this.fechaInicialDate = new Date(this.fechaSeleccionada);
    this.fechaInicialDate.setUTCHours(12, 0, 0, 0);
  
    // Formatear la fecha inicial en el formato adecuado para el campo de fecha
    const year = this.fechaInicialDate.getUTCFullYear();
    const month = (this.fechaInicialDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = this.fechaInicialDate.getUTCDate().toString().padStart(2, '0');
    const hours = this.fechaInicialDate.getUTCHours().toString().padStart(2, '0');
    const minutes = this.fechaInicialDate.getUTCMinutes().toString().padStart(2, '0');

    this.fechaInicial = `${year}-${month}-${day}T${hours}:${minutes}`;
    this.fechaFin = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  guardarEvento() {
    const fechaActual = new Date();
    
    const fechaInicial = new Date(this.fechaInicial);
    
    // console.log('Inicial :',fechaInicial);
    // console.log('Actual :',fechaActual);
    
    if (fechaInicial < fechaActual) {
      // Mostrar mensaje de error o realizar la acción correspondiente
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Fecha incorrecta !`,
        text: 'Debes seleccionar una fecha igual o posterior a la actual!',
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
      console.log("Error: La fecha de inicio debe ser igual o posterior al día actual.");
      return;
    };
  
    const evento = {
      titulo: this.tituloEvento,
      fechaStart: new Date(this.fechaInicial),
      fechaEnd: new Date(this.fechaFin)
    };

    this.modal.close(evento);
  }
}

