import { Injectable } from '@angular/core';
import { serialize } from 'object-to-formdata';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  login( credenciales:any ){
    const CRED = serialize(credenciales);
    // return this.http.post(`https://proyectotapatio.com/PT-API-P/login/login.php`, CRED).pipe(retry(3))
    return this.http.post(`http://localhost:8080/PT-API/login/login.php`, CRED).pipe(retry(3))
  }
}
