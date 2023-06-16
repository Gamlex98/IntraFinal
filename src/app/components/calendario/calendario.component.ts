import { Component, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarService } from 'src/app/services/calendar.service'; 
import { EventModel } from 'src/app/models/event.model'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  providers:[CalendarService]
})
export class CalendarioComponent {

  fechaSeleccionada !: string;
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    locale: esLocale ,
    weekends: true,
    // editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
 /*    eventAdd: this.handleEventAdd.bind(this), */
  }

  currentEvents: EventApi[] = [];

  constructor( private changeDetector: ChangeDetectorRef, private calendarService: CalendarService, private modalService: NgbModal) {}

  ngOnInit() {
    this.refreshEvents(); // Obtener eventos al iniciar el componente y al agregar / eliminar
  }

  refreshEvents() {
    this.calendarService.getEvents().subscribe((events) => {
      this.calendarOptions.events = events;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
  this.fechaSeleccionada = selectInfo.startStr;
  // console.log(this.fechaSeleccionada);

  const modalRef = this.modalService.open(ModalComponent);
  modalRef.componentInstance.fechaSeleccionada = this.fechaSeleccionada; // Pasar la fecha seleccionada al modal
  modalRef.result.then((result) => {
    if (result) {
      // console.log('Result Modal:',result);
      const { titulo, fechaStart, fechaEnd } = result;
      const calendarApi = selectInfo.view.calendar;
  
      // console.log('Título:', titulo);
      // console.log('Fecha de inicio:', fechaStart);
      // console.log('Fecha de fin:', fechaEnd);
  
      calendarApi.unselect(); // clear date selection

      calendarApi.addEvent({
        id: createEventId(),
         title: titulo,
        start: fechaStart,
        end: fechaEnd,
        allDay: selectInfo.allDay
      });
  
      let eventoGuardar = new EventModel();
      eventoGuardar.title = titulo;
      eventoGuardar.start = fechaStart;
      eventoGuardar.end = fechaEnd;
      this.grabarEventoBD(eventoGuardar);
      this.refreshEvents(); 
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Evento : <span style="color: blue; text-decoration: underline">${titulo}</span>  guardado Existosamente !`,
        showConfirmButton: false,
        timer: 1000
        });
      }
    });
  }   

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEventClick(clickInfo: EventClickArg) {
    Swal.fire({
      title: `Estas seguro que deseas eliminar este evento? <span style="color: red; text-decoration: underline">${clickInfo.event.title}</span>`,
      text: "No podrás deshacer esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.calendarService.removeEvent(clickInfo.event.id).subscribe({
          next: (data:any)=>{
              console.log("Evento borrado de la BD",data);
              this.refreshEvents(); 
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Evento Borrado Exitosamente !!',
                showConfirmButton: false,
                timer: 1000
                });
            },
          error:(e)=> console.log(e)
          });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `Cancelado`,
          text:'Tu evento esta seguro :)',
          showConfirmButton: false,
          timer: 1000
          });
      }
    })
  }

  // LISTADO GENERAL DE EVENTOS 

  /* handleEvents(events: EventApi[]) {
    this.currentEvents = events.sort((a, b) => {
      // Ordenar por fecha de inicio en orden descendente
      const aStart = a.start?.getTime() || 0; // Valor predeterminado en caso de nulo
      const bStart = b.start?.getTime() || 0; // Valor predeterminado en caso de nulo
  
      return bStart - aStart;
    });
    this.changeDetector.detectChanges();
  } */

  //LISTADO EVENTOS DIA ACTUAL 
  
  handleEvents(events: EventApi[]) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentDateTime = currentDate.getTime();
  
    const activeEvents = events.filter(event => {
      const eventStart = event.start?.getTime() || 0;
      const eventEnd = event.end?.getTime() || 0;
      const eventYear = event.start?.getFullYear() || 0;
      const eventMonth = event.start?.getMonth() || 0;
      const eventDay = event.start?.getDate() || 0;
  
      return eventYear === currentYear && eventMonth === currentMonth && eventDay === currentDay && eventEnd > currentDateTime;
    });
  
    const expiredEvents = events.filter(event => {
      const eventStart = event.start?.getTime() || 0;
      const eventEnd = event.end?.getTime() || 0;
      const eventYear = event.start?.getFullYear() || 0;
      const eventMonth = event.start?.getMonth() || 0;
      const eventDay = event.start?.getDate() || 0;
  
      return eventYear === currentYear && eventMonth === currentMonth && eventDay === currentDay && eventStart < currentDateTime && eventEnd < currentDateTime;
    });
  
    setTimeout(() => {
      this.currentEvents = [...activeEvents, ...expiredEvents];
    });
  }
  
  
  isEventExpired(event: EventApi): boolean {
    const currentDateTime = new Date().getTime();
    const eventEnd = event.end?.getTime() || 0;
  
    return eventEnd< currentDateTime;
  }
  
  
  //Graba en la base de datos el evento ingresado por el usuario
  grabarEventoBD(eventoGrabar: EventModel){
    this.calendarService.addEvent(eventoGrabar).subscribe({
      next: (data:any)=>{
        console.log("Evento guaardado en base de datos");
        this.changeDetector.detectChanges();
        },
      error:(e)=> console.log(e)
      });
}

}
