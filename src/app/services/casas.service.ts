import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';
import {environment} from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class CasasService {

  url = environment.apiUrl+"casas/";

  eventos = null;

  constructor(private http:HttpClient ) { }

  getCasas(){
    return this.http.get(`${this.url}VerCasas.php`).pipe(retry(3))
  }

  getCasa( id:number ){
    return this.http.get(`${this.url}getCasa.php?id_evento=${id}`).pipe(retry(3))
  }

  getImgs( id:number ){
    return this.http.get(`${this.url}getImagenes.php?id_evento=${id}`).pipe(retry(3))
  }

  eliminarImgs( id:number ){
    return this.http.get(`${this.url}eliminarImgs.php?id_imagen=${id}`).pipe(retry(3))
  }

  buscarNombre( nombre:string, id:number = null ){
    return this.http.get(`${this.url}consultaNombre.php?nombre=${nombre}&id=${id}`).pipe(retry(3))
  }

  crearCasa( evento:any ){
    const EVENTO_FD = serialize(evento);
    return this.http.post(`${this.url}crearCasa.php`, EVENTO_FD)//.pipe(retry(3))
  }

  modificarInfoCasa( info:any ){
    const INFOEVENTO_FD = serialize(info);
    return this.http.post(`${this.url}modificarInfoCasa.php`, INFOEVENTO_FD).pipe(retry(3))
  }

  modificarHorarioCasa( horario:any ){
    const HORARIOEVENTO_FD = serialize(horario);
    return this.http.post(`${this.url}modificarHorarioCasa.php`, HORARIOEVENTO_FD).pipe(retry(3))
  }

  modificarImgsCasa( imgs:any ){
    const IMGSEVENTO_FD = serialize(imgs);
    return this.http.post(`${this.url}modificarImgsCasa.php`, IMGSEVENTO_FD).pipe(retry(3))
  }

  buscarBoletos(id_evento:number){
    return this.http.get(`${this.url}consultaBoletos.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  eliminarCasa( id:number ){
    return this.http.get(`${this.url}eliminarCasa.php?id=${id}`).pipe(retry(3))
  }

  cancelarCasa(id_evento:number){
    return this.http.get(`${this.url}cancelarCasa.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  buscarCasa( nombre:string ){
    return this.http.get(`${this.url}buscarCasa.php?nombre_evento=${nombre}`).pipe(retry(3))
  }

  buscarLugar(  orden:number){
    return this.http.get(`${this.url}consultaOrden.php?orden_anuncio=${orden}`).pipe(retry(3))
  }

  liberarLugar( orden:number, id:number=null ){
    return this.http.get(`${this.url}liberarLugar.php?orden=${orden}&id=${id}`).pipe(retry(3))
  }

  getVentasEdad( id_evento:number){
    return this.http.get(`${this.url}EdadCasa.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  getVentasTotales( id_evento:number ){
    return this.http.get(`${this.url}VentasTotales.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  getVentasDia( fecha:any, id_evento:number ){
    return this.http.get(`${this.url}VentasDia.php?id_evento=${id_evento}&fecha=${fecha}`)
  }

  getVentasR( fecha_1:any, fecha_2:any, id_evento:number ){
    return this.http.get(`${this.url}VentasRango.php?id_evento=${id_evento}&fecha_i=${fecha_1}&fecha_f=${fecha_2}`).pipe(retry(3))
  }

  getComentarios(id_evento:Number){
    return this.http.get(`${this.url}VerComentarios.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  eliminarComentrio(id_cal:number){
    return this.http.get(`${this.url}EliminarComentario.php?id_cal=${id_cal}`).pipe(retry(3))
  }
}
