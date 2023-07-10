import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

urlLoopback = 'http://172.16.1.249:3030';

constructor( 
  private http : HttpClient,
  
  ) { }

  getDataUserByBirthMonth(month: string): Observable<any> {
    const filter = {
      where: {
        $expr: {
          $eq: [{ $month: '$fechaNacimiento' }, Number(month)]
        }
      }
    };
  
    return this.http.get(`${this.urlLoopback}/usuarios?filter=${encodeURIComponent(JSON.stringify(filter))}`);
  }
  
  filterDate ( filtering: String) {
      
    }
  
}
