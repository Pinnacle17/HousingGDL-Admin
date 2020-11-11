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

  getColonias(){
    return this.http.get(`${this.url}verColonias.php`)
  }
  getCasas(){
    return this.http.get(`${this.url}verCasas.php`)//.pipe(retry(3))
  }

  getCasa( id:number ){
    return this.http.get(`${this.url}verCasa.php?id_casa=${id}`)//.pipe(retry(3))
  }

  getImgs( id:number ){
    return this.http.get(`${this.url}verImagenesCasa.php?id_casa=${id}`)//.pipe(retry(3))
  }

  eliminarImgCasa( id:number ){
    let data = new FormData()
    data.append('id_imagen_casa',id.toString())
    return this.http.post(`${this.url}eliminarImgCasa.php`,data)//.pipe(retry(3))
  }
  consultaNombre( nombre:string, id:number = -1 ){
    return this.http.get(`${this.url}consultaNombre.php?nombre_casa=${nombre}&id_casa=${id}`)//.pipe(retry(3))
  }

  crearCasa( casa:any ){
    const CASA_FD = serialize(casa);
    return this.http.post(`${this.url}crearCasa.php`, CASA_FD)//.pipe(retry(3))
  }

  modificarInfoCasa( info:any ){
    const INFOEVENTO_FD = serialize(info);
    return this.http.post(`${this.url}modificarInfoCasa.php`, INFOEVENTO_FD)//.pipe(retry(3))
  }

  modificarImgsCasa( imgs:any , id_casa:string){
    const IMGSEVENTO_FD = serialize(imgs);
    IMGSEVENTO_FD.append('id_casa',id_casa)
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
    return this.http.get(`${this.url}buscarCasas.php?nombre=${nombre}`)//.pipe(retry(3))
  }

  buscarLugar(  orden:number){
    return this.http.get(`${this.url}consultaOrden.php?orden_anuncio=${orden}`)//.pipe(retry(3))
  }

  liberarLugar( orden:number, id:number=null ){
    return this.http.get(`${this.url}liberarLugar.php?orden_anuncio=${orden}&id_casa=${id}`)//.pipe(retry(3))
  }

  getComentarios(id_casa:Number){
    return this.http.get(`${this.url}comentarios/verComentarios.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }
  getComentariosNotificacion(id_casa:Number){
    return this.http.get(`${this.url}comentarios/verComentariosNotificacion.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }
  DesactivarComentario(id_cal:number){
    return this.http.get(`${this.url}comentarios/desactivarComentario.php?id_calificacion=${id_cal}`)//.pipe(retry(3))
  }

  ActivarComentario(id_cal:number){
    return this.http.get(`${this.url}comentarios/confirmarComentario.php?id_calificacion=${id_cal}`)//.pipe(retry(3))
  }
  eliminarSemestre(id_semestre:number){
    return this.http.get(`${this.url}eliminarSemestre.php?id_semestre=${id_semestre}`)//.pipe(retry(3))
  }
  crearSemestre( semestre:any ){
    const SEMESTRE_FD = serialize(semestre);
    return this.http.post(`${this.url}insertaSemestre.php`, SEMESTRE_FD)//.pipe(retry(3))
  }

  getEstadisticasNacionalidades(){
    return this.http.get(`${this.url}nacionalidades.php`)//.pipe(retry(3))
  }
  getEstadisticasCasas(){
    return this.http.get(`${this.url}promedioDiasCasa.php`)//.pipe(retry(3))
  }
  getEstadisticasColonias(){
    return this.http.get(`${this.url}promedioDiasColonia.php`)//.pipe(retry(3))
  }

}
