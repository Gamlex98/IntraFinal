import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  titulo !: string;
  fechaInicio !: string;
  fechaFin !: string;

  constructor(public modal: NgbActiveModal) {}

  guardarEvento() {
    const evento = {
      titulo: this.titulo,
      fechaStart: new Date(this.fechaInicio),
      fechaEnd: new Date(this.fechaFin)
    };
    this.modal.close(evento);
  }
}

