
import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
   {
    id: createEventId(),
    title: 'Evento 1',
    start: TODAY_STR + 'T02:00:00',
    end: TODAY_STR + 'T08:00:00'
  },
/*
  {
    id: createEventId(),
    title: 'Evento 2',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  },
  {
    id: createEventId(),
    title: 'Evento 3',
    start: TODAY_STR + 'T16:00:00',
    end: TODAY_STR + 'T18:00:00'
  } */
];

 export function createEventId() {
  return String(eventGuid++);
} 
