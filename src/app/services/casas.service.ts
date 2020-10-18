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

  casas = null;

  constructor(private http:HttpClient ) { }

  getCasas(){
    return this.http.get(`${this.url}VerCasas.php`)//.pipe(retry(3))
  }

  getCasa( id:number ){
    return this.http.get(`${this.url}VerCasa.php?id_casa=${id}`)//.pipe(retry(3))
  }

  getImgs( id:number ){
    return this.http.get(`${this.url}verImagenesCasa.php?id_casa=${id}`)//.pipe(retry(3))
  }

  eliminarImgs( id:number ){
    return this.http.get(`${this.url}eliminarImgs.php?id_imagen=${id}`)//.pipe(retry(3))
  }

  consultaNombre( nombre:string, id:number = -1 ){
    return this.http.get(`${this.url}consultaNombre.php?nombre_casa=${nombre}&id_casa=${id}`)//.pipe(retry(3))
  }

  crearCasa( casa:any ){
    const EVENTO_FD = serialize(casa);
    return this.http.post(`${this.url}crearCasa.php`, EVENTO_FD)//.pipe(retry(3))
  }

  modificarInfoCasa( info:any ){
    const INFOEVENTO_FD = serialize(info);
    return this.http.post(`${this.url}modificarInfoCasa.php`, INFOEVENTO_FD)//.pipe(retry(3))
  }

  modificarHorarioCasa( horario:any ){
    const HORARIOEVENTO_FD = serialize(horario);
    return this.http.post(`${this.url}modificarHorarioCasa.php`, HORARIOEVENTO_FD)//.pipe(retry(3))
  }

  modificarImgsCasa( imgs:any ){
    const IMGSEVENTO_FD = serialize(imgs);
    return this.http.post(`${this.url}modificarImgsCasa.php`, IMGSEVENTO_FD)//.pipe(retry(3))
  }

  buscarBoletos(id_casa:number){
    return this.http.get(`${this.url}consultaBoletos.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }

  activarCasa( id_casa:number ){
    return this.http.get(`${this.url}activarCasa.php?id_casa=${id_casa}`)////.pipe(retry(3))
  }

  cancelarCasa(id_casa:number){
    return this.http.get(`${this.url}cancelarCasa.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }

  buscarCasa( nombre:string ){
    return this.http.get(`${this.url}buscarCasa.php?nombre_casa=${nombre}`)//.pipe(retry(3))
  }

  buscarLugar(  orden:number){
    return this.http.get(`${this.url}consultaOrden.php?orden_anuncio=${orden}`)//.pipe(retry(3))
  }

  liberarLugar( orden:number, id:number=null ){
    return this.http.get(`${this.url}liberarLugar.php?orden=${orden}&id=${id}`)//.pipe(retry(3))
  }

  getVentasEdad( id_casa:number){
    return this.http.get(`${this.url}EdadCasa.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }

  getVentasTotales( id_casa:number ){
    return this.http.get(`${this.url}VentasTotales.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }

  getVentasDia( fecha:any, id_casa:number ){
    return this.http.get(`${this.url}VentasDia.php?id_casa=${id_casa}&fecha=${fecha}`)
  }

  getVentasR( fecha_1:any, fecha_2:any, id_casa:number ){
    return this.http.get(`${this.url}VentasRango.php?id_casa=${id_casa}&fecha_i=${fecha_1}&fecha_f=${fecha_2}`)//.pipe(retry(3))
  }

  getComentarios(id_casa:Number){
    return this.http.get(`${this.url}VerComentarios.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }

  eliminarComentrio(id_cal:number){
    return this.http.get(`${this.url}EliminarComentario.php?id_cal=${id_cal}`)//.pipe(retry(3))
  }
}
