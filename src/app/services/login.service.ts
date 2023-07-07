import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user: userModel[]=[];

  urlLoopback = 'http://172.16.1.249:3030';

constructor( 
  private http: HttpClient,
) { }

dataUser () {

}

autenticate () {

}

registerUser () {

}

resetPassword () {

}

}
