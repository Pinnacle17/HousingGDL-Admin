import { Injectable } from '@angular/core';
import { serialize } from 'object-to-formdata';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import {of} from 'rxjs';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = environment.apiUrl;
  constructor(private http:HttpClient) { }

  login( credenciales:any ){
    const CRED = serialize(credenciales);
    // return this.http.post(`https://proyectotapatio.com/PT-API-P/login/login.php`, CRED).pipe(retry(3))
    return this.http.post(`${this.url}login/login.php`, CRED).pipe(retry(3))
  }
}
