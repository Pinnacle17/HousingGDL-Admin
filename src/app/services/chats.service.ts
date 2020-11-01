import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  // url = "https://proyectotapatio.com/PT-API-P/repartidores/";
  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  bloquearChat( id_chat:number){
    return this.http.get(`${this.url}chats/bloquearChat.php?id_chat=${id_chat}`)//.pipe(retry(3))
  }

  cambiarEstadoNotificacion( id_chat:number){
    return this.http.get(`${this.url}chats/cambiarEstadoNotificacion.php?id_chat=${id_chat}`)//.pipe(retry(3))
  }

  cancelarChat( id_chat:number, mensaje:string){
    return this.http.get(`${this.url}chats/cancelarChat.php?id_chat=${id_chat}&mensaje=${mensaje}`)//.pipe(retry(3))
  }

  confirmarCompra(id_chat:any){
    return this.http.get(`${this.url}chats/confirmarCompra.php?id_chat=${id_chat}`)//.pipe(retry(3))
  }

  enviarMensaje(id_chat:number, mensaje:string){
    return this.http.get(`${this.url}chats/enviarMensaje.php?id_chat=${id_chat}&mensaje=${mensaje}`)//.pipe(retry(3))
  }

  filtroChat(estado:number){
    return this.http.get(`${this.url}chats/filtroChat.php?estado=${estado}`)//.pipe(retry(3))
  }

  verChatsNotificacion(){
    return this.http.get(`${this.url}chats/verDatosChat.php`)//.pipe(retry(3))
  }

  verDatosChat(id_chat:number){
    return this.http.get(`${this.url}chats/verDatosChat.php?id_chat=${id_chat}`)//.pipe(retry(3))
  }

  verMensajesChat(id_chat:number){
    return this.http.get(`${this.url}chats/verMensajesChat.php?id_chat=${id_chat}`)//.pipe(retry(3))
  }


}
