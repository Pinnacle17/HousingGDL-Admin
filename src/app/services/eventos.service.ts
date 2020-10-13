import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  // url = "https://proyectotapatio.com/PT-API-P/eventos/";
  url = "http://localhost:8080/PT-API/eventos/";

  eventos = null;

  constructor(private http:HttpClient ) { }

  getEventos( tipo:number=-1 ){
    return this.http.get(`${this.url}getEventos.php?tipo=${tipo}`).pipe(retry(3))
  }

  getEvento( id:number ){
    return this.http.get(`${this.url}getEvento.php?id_evento=${id}`).pipe(retry(3))
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

  crearEvento( evento:any ){
    const EVENTO_FD = serialize(evento);
    return this.http.post(`${this.url}crearEvento.php`, EVENTO_FD).pipe(retry(3))
  }

  modificarInfoEvento( info:any ){
    const INFOEVENTO_FD = serialize(info);
    return this.http.post(`${this.url}modificarInfoEvento.php`, INFOEVENTO_FD).pipe(retry(3))
  }

  modificarHorarioEvento( horario:any ){
    const HORARIOEVENTO_FD = serialize(horario);
    return this.http.post(`${this.url}modificarHorarioEvento.php`, HORARIOEVENTO_FD).pipe(retry(3))
  }

  modificarImgsEvento( imgs:any ){
    const IMGSEVENTO_FD = serialize(imgs);
    return this.http.post(`${this.url}modificarImgsEvento.php`, IMGSEVENTO_FD).pipe(retry(3))
  }

  buscarBoletos(id_evento:number){
    return this.http.get(`${this.url}consultaBoletos.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  eliminarEvento( id:number ){
    return this.http.get(`${this.url}eliminarEvento.php?id=${id}`).pipe(retry(3))
  }

  cancelarEvento(id_evento:number){
    return this.http.get(`${this.url}cancelarEvento.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  buscarEvento( nombre:string ){
    return this.http.get(`${this.url}buscarEvento.php?nombre_evento=${nombre}`).pipe(retry(3))
  }

  buscarLugar(  orden:number , id:number=null){
    return this.http.get(`${this.url}consultaOrden.php?orden=${orden}&id=${id}`).pipe(retry(3))
  }

  liberarLugar( orden:number, id:number=null ){
    return this.http.get(`${this.url}liberarLugar.php?orden=${orden}&id=${id}`).pipe(retry(3))
  }

  getVentasEdad( id_evento:number){
    return this.http.get(`${this.url}EdadEvento.php?id_evento=${id_evento}`).pipe(retry(3))
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
