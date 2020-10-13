import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  // url = "https://proyectotapatio.com/PT-API-P/repartidores/";
  url = "http://localhost:8080/PT-API/repartidores/";

  constructor(private http:HttpClient) { }

  crearRepartidor( repartidor:any ){
    const REPARTIDOR_FD = serialize(repartidor);
    return this.http.post(`${this.url}crearRepartidor.php`, REPARTIDOR_FD).pipe(retry(3))
  }

  getRepartidores(){
    return this.http.get(`${this.url}getRepartidores.php`).pipe(retry(3))
  }

  getRepartidor(id:number){
    return this.http.get(`${this.url}getRepartidor.php?id=${id}`).pipe(retry(3))
  }

  modificarRepartidor( info:any ){
    const INFO = serialize(info);
    return this.http.post(`${this.url}modificarRepartidor.php`, INFO).pipe(retry(3))
  }

  eliminarRepartidor( id:number ){
    return this.http.get(`${this.url}eliminarRepartidor.php?id=${id}`).pipe(retry(3))
  }

  buscarRepartidor(nombre:string){
    return this.http.get(`${this.url}buscarRepartidor.php?nombre_rep=${nombre}`).pipe(retry(3))
  }

  insertarStock( datos:any ){
    const DATOS = serialize(datos);
    return this.http.post(`${this.url}insertarStock.php`, DATOS).pipe(retry(3))
  }

  getHistorial( id:number ){
    return this.http.get(`${this.url}getHistorial.php?id_rep=${id}`).pipe(retry(3))
  }

  getBoletos( id:number ){
    return this.http.get(`${this.url}getBoletos.php?id_rep=${id}`).pipe(retry(3))
  }
}
