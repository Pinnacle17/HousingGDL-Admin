import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  // url = "https://proyectotapatio.com/PT-API-P/publicaciones/";
  url = "http://localhost:8080/PT-API/publicaciones/";

  constructor(private http:HttpClient) { }

  getPublicaciones(){
    return this.http.get(`${this.url}getPublicaciones.php`).pipe(retry(3))
  }

  getPublicacion( id_pub:number ){
    return this.http.get(`${this.url}getPublicacion.php?id_publicacion=${id_pub}`).pipe(retry(3))
  }

  getImgs( id:number ){
    return this.http.get(`${this.url}getImagenes.php?id_pub=${id}`).pipe(retry(3))
  }

  crearPublicacion( publicacion:any ){
    const PUBLICACION_FD = serialize(publicacion);
    return this.http.post(`${this.url}crearPublicacion.php`, PUBLICACION_FD).pipe(retry(3))
  }

  modificarInfoPub( infoPub:any ){
    const INFO_PUB_FD = serialize(infoPub);
    return this.http.post(`${this.url}modificarInfoPub.php`, INFO_PUB_FD).pipe(retry(3))
  }

  modificarImgsPub( imgsPub:any ){
    const IMGS_PUB_FD = serialize(imgsPub);
    return this.http.post(`${this.url}modificarImgsPub.php`, IMGS_PUB_FD).pipe(retry(3))
  }

  eliminarPublicacion( id_pub:number ){
    return this.http.get(`${this.url}eliminarPublicacion.php?id_publicacion=${id_pub}`).pipe(retry(3))
  }

  eliminarImgs( id_img:number ){
    return this.http.get(`${this.url}eliminarImgs.php?id_img=${id_img}`).pipe(retry(3))
  }

  buscarPub( nombre:string ){
    return this.http.get(`${this.url}buscarPublicacion.php?nombre_pub=${nombre}`).pipe(retry(3))
  }

  buscarNombre( nombre:string, id:number = null ){
    return this.http.get(`${this.url}consultaNombre.php?nombre=${nombre}&id=${id}`).pipe(retry(3))
  }
}
