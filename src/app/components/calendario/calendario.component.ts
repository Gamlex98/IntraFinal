import { Component, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventAddArg, EventRemoveArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarService } from 'src/app/services/calendar.service'; 
import { EventModel } from 'src/app/models/event.model'; 
import { StandardEvent, startOfDay } from '@fullcalendar/core/internal';

@Component({
  selector: 'app-root',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  providers:[CalendarService]
})
export class CalendarioComponent {
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
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
 /*    eventAdd: this.handleEventAdd.bind(this), */
    eventRemove: this.handleEventRemove.bind(this)
  };

  currentEvents: EventApi[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef, private calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.getEvents().subscribe(events => {
      this.calendarOptions.events = events;
    });
  }


  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('INGRESA EL TITULO PARA EL NUEVO EVENTO');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
      //Va a grabar el evento en la BD
      //Ajusta el formato de las horas para ajsutarlo a ISO 8601
      let fechaStart = new Date(selectInfo.startStr);
      let horas= fechaStart.getHours();
      //Le adiciona 5 horas porque CO es UTC-5 //Para compensar
      horas=horas+7;
      fechaStart.setHours(horas);
      let fechaEnd = new Date(selectInfo.endStr);
      let horasEnd= fechaEnd.getHours();
      //Le adiciona 5 horas porque CO es UTC-5 //Para compensar
      horasEnd=horasEnd+7;
      fechaEnd.setHours(horasEnd);

      let eventoaGuardar = new EventModel();
      eventoaGuardar.title = title;
      eventoaGuardar.start =fechaStart;
      eventoaGuardar.end = fechaEnd;
      this.grabarEventoBD(eventoaGuardar);

    }
  }

  handleEventRemove(arg: EventRemoveArg) {
    console.log(arg.event.id);
    this.calendarService.removeEvent(arg.event.id).subscribe(event => {
      console.log('Event deleted successfully:', event);
    }, error => {
      console.log('Error deleting event:', error);
    });
  }



  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿ ESTAS SEGURO QUE DESEAS ELIMINAR ESTE EVENTO ? '${clickInfo.event.title}'`)) {
      console.log(clickInfo.event.id);
      // clickInfo.event.remove();
      this.calendarService.removeEvent(clickInfo.event.id).subscribe({
        next: (data:any)=>{
            console.log("evento borrado de la BD") 
          },
        error:(e)=> console.log(e)
        });
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }


  //Graba en la base de datos el evento ingresado por el usuario
  grabarEventoBD(eventoGrabar: EventModel){
    this.calendarService.addEvent(eventoGrabar).subscribe({
      next: (data:any)=>{
        console.log("Evento guaardado en base de datos");
        },
      error:(e)=> console.log(e)
      });
}

}

