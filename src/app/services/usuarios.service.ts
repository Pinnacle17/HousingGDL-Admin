import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // url = "https://proyectotapatio.com/PT-API-P/usuarios/";
  url = "http://localhost:8080/PT-API/usuarios/";

  constructor( private http:HttpClient ) { }

  getUsuarios(){
    return this.http.get(`${this.url}getUsuarios.php`).pipe(retry(3));
  }

  buscarUsuario(nombre:string){
    return this.http.get(`${this.url}buscarUsuario.php?nombre_usuario=${nombre}`).pipe(retry(3))
  }

  eliminarUsuario( id:number ){
    return this.http.get(`${this.url}eliminarUsuario.php?id=${id}`).pipe(retry(3))
  }

  getAdmin(id:number){
    return this.http.get(`${this.url}getAdmin.php?id=${id}`).pipe(retry(3))
  }

  getUsuario(id_usuario:number,id_fb:string=null){
    return this.http.get(`${this.url}getUsuario.php?id_fb=${id_fb}&id_usuario=${id_usuario}`).pipe(retry(3))
  }

  verVentas(id_usuario:number){
    return this.http.get(`${this.url}VerVentas.php?id_usuario=${id_usuario}`).pipe(retry(3))
  }

  elementosVenta(id_venta:number){
    return this.http.get(`${this.url}VerElementosVentaIndividual.php?id_venta=${id_venta}`).pipe(retry(3))
  }

}
