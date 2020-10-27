import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CuartosService{
  imgUrl = environment.imgUrl
  url = environment.apiUrl+"casas/cuartos/";

  constructor(private http:HttpClient) { }

  crearCuarto( cuarto:any, id_casa:string ){
    const CUARTO_FD = serialize(cuarto);
    CUARTO_FD.append('id_casa', id_casa)
    return this.http.post(`${this.url}crearCuarto.php`, CUARTO_FD)//.pipe(retry(3))
  }
  crearOferta( oferta:any ){
    const OFERTA_FD = serialize(oferta);
    return this.http.post(`${this.url}crearOferta.php`, OFERTA_FD)//.pipe(retry(3))
  }
  activarCuarto( id_cuarto:any ){
    return this.http.get(`${this.url}activarCuarto.php?id_cuarto=${id_cuarto}`)//.pipe(retry(3))
  }
  desactivarCuarto( id_cuarto:any ){
    return this.http.get(`${this.url}desactivarCuarto.php?id_cuarto=${id_cuarto}`)//.pipe(retry(3))
  }
  eliminarImgCuarto( id:number ){
    let data = new FormData()
    data.append('id_imagen_cuarto',id.toString())
    return this.http.post(`${this.url}eliminarImgCuarto.php`,data)//.pipe(retry(3))
  }
  eliminarOferta( id_oferta:number ){
    return this.http.get(`${this.url}eliminarOferta.php?id_oferta=${id_oferta}`)//.pipe(retry(3))
  }
  modificarImgsCuarto( imgs:any){
    const IMGSCUARTO_FD = serialize(imgs);
    return this.http.post(`${this.url}modificarImgsCuarto.php`, IMGSCUARTO_FD)//.pipe(retry(3))
  }
  modificarInfoCuarto( info:any ){
    const INFOCUARTO_FD = serialize(info);
    return this.http.post(`${this.url}modificarInfoCuarto.php`, INFOCUARTO_FD)//.pipe(retry(3))
  }
  getCuarto( id_cuarto:number ){
    return this.http.get(`${this.url}VerCuarto.php?id_cuarto=${id_cuarto}`)//.pipe(retry(3))
  }
  getCuartos( id_casa:number ){
    return this.http.get(`${this.url}VerCuartos.php?id_casa=${id_casa}`)//.pipe(retry(3))
  }
  getImgs( id_cuarto:number ){
    return this.http.get(`${this.url}verImagenesCuarto.php?id_cuarto=${id_cuarto}`)//.pipe(retry(3))
  }
  getSemestres(){
    return this.http.get(`${this.url}VerSemestres.php`)
  }
  getOferta(){
    return this.http.get(`${this.url}oferta_semestre.php`)
  }
}
