import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { createEventId } from './event-utils';
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
  providers: [CalendarService]
})
export class CalendarioComponent implements OnInit {
  visible !: boolean;
  fechaSeleccionada!: string;
  fechaEvento !: Date;
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
    locale: esLocale,
    weekends: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };

  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef, private calendarService: CalendarService, private modalService: NgbModal) { }

  ngOnInit() {
    this.refreshEvents();
  }

  //Refrescar los Eventos disponibles en la BD
  refreshEvents() {
    this.calendarService.getEvents().subscribe((events: EventModel[]) => {
      this.calendarOptions.events = events;
      // console.log('Eventos:', events);
    });
  }

  // Seleccionar dia y agregar Evento usando Modal
  handleDateSelect(selectInfo: DateSelectArg) {
    this.fechaSeleccionada = selectInfo.startStr;

    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.fechaSeleccionada = this.fechaSeleccionada;
  
    modalRef.result.then((result) => {
      if (result) {
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
        
      }}).catch(() => {
      // Maneja cualquier error que ocurra al abrir o cerrar el modal.
      console.log('Modal Cancelado por el Usuario');
    });
  }
  
  //Eliminar eventos
  handleEventClick(clickInfo: EventClickArg) {
    // Comparamos la hora actual con la hora del evento seleccionado para restringir la eliminación.
    this.fechaSeleccionada = clickInfo.event.startStr;
    const actualDate = new Date();
    this.fechaEvento = new Date(this.fechaSeleccionada);
  
    console.log('fechaActual:', actualDate);
    console.log('fechaEvento:', this.fechaEvento);
  
    let allowDeletion = true;
  
    if (actualDate > this.fechaEvento) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `No se puede eliminar el evento : <span style="color: blue; text-decoration: underline">${clickInfo.event.title}</span>`,
        text: `Este evento ha vencido y no se puede eliminar.`,
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
  
      allowDeletion = false;
    }
  
    if (this.isEventRunning(clickInfo.event)) {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: `Este evento: <span style="color: blue; text-decoration: underline">${clickInfo.event.title}</span> está en ejecución`,
        text: 'No se puede eliminar un evento que está en curso.',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
  
      allowDeletion = false;
    }
  
    if (allowDeletion) {
      Swal.fire({
        title: `¿Estás seguro de que deseas eliminar este evento? <span style="color: blue; text-decoration: underline">${clickInfo.event.title}</span>`,
        text: "No podrás deshacer esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.calendarService.removeEvent(clickInfo.event.id).subscribe({
            next: (data: any) => {
              console.log("Evento borrado de la BD", data);
              this.refreshEvents();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Evento eliminado exitosamente!',
                showConfirmButton: false,
                timer: 1000
              });
            },
            error: (e) => console.log(e)
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Cancelado',
            text: 'Tu evento está seguro :)',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    }
  }

  //Array Eventos Dia Actual / Catalogados como activos / vencidos
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

    activeEvents.sort((a, b) => {
      const startTimeA = a.start?.getTime() || 0;
      const startTimeB = b.start?.getTime() || 0;
      return startTimeA - startTimeB;
    });

    expiredEvents.sort((b, a) => {
      const startTimeA = b.start?.getTime() || 0;
      const startTimeB = a.start?.getTime() || 0;
      return startTimeB - startTimeA;
    });

    setTimeout(() => {
      this.currentEvents = [...activeEvents, ...expiredEvents];
      this.refreshEvents();
    });
  }

  //Eventos Vencidos 
  isEventExpired(event: EventApi): boolean {
    const currentDateTime = new Date().getTime();
    const eventEnd = event.end?.getTime() || 0;

    return eventEnd < currentDateTime;
  }

  //Eventos en Ejecucion 
  isEventRunning(event: EventApi): boolean {
    const currentDateTime = new Date().getTime();
    const eventStart = event.start?.getTime() || 0;
    const eventEnd = event.end?.getTime() || 0;
  
    return eventStart <= currentDateTime && currentDateTime <= eventEnd;
  }
  
  //Eventos Programados
  isEventProgram(event: EventApi): boolean {
    const currentDateTime = new Date().getTime();
    const eventStart = event.start?.getTime() || 0;
    const eventEnd = event.end?.getTime() || 0;
  
    return currentDateTime < eventStart;
  }
  
  // Vista completa Calendario
  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  } 

  //Guardar informacion en la BD
  grabarEventoBD(eventoGrabar: EventModel) {
    this.calendarService.addEvent(eventoGrabar).subscribe({
      next: (data: any) => {
        console.log("Evento guaardado en base de datos");
        this.refreshEvents();
        this.changeDetector.detectChanges();
      },
      error: (e) => console.log('Error al Guardar el Evento',e)
    });
  }

}