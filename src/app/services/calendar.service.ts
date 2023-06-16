import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventModel } from '../models/event.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  url = 'http://172.16.1.249:3030';

  constructor(private http: HttpClient) { }

  addEvent(event: EventModel): Observable<any> {
    // console.log("En el servicio de addEvent:")    
    // console.log(event.title);
    // console.log(event.start);
    // console.log(event.end);
    return this.http.post(`${this.url}/evento-calendarios`,
    {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
    });
  }

  getEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.url}/evento-calendarios`).pipe(
      map(events => events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end
      })))
    );
  }
  
  removeEvent(id: string ): Observable<any> {
    return this.http.delete<any>(`${this.url}/evento-calendarios/${id}`)
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else
     {
      console.error(

        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
  }
}
