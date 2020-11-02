import { Component, OnInit,Input  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() childMessage: number;

  /*msgs:any=[
    {
      id_mensaje:1,
      mensaje:"Mensaje 1",
      fecha:new Date(1995,11,11),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:2,
      mensaje:"Mensaje 2",
      fecha:new Date(1995,11,12),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:3,
      mensaje:"Mensaje 3",
      fecha:new Date(1995,11,13),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:4,
      mensaje:"Mensaje 4",
      fecha:new Date(1995,11,14),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:5,
      mensaje:"Mensaje 5",
      fecha:new Date(1995,11,15),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:6,
      mensaje:"Mensaje 6",
      fecha:new Date(1995,11,16),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:7,
      mensaje:"Mensaje 7",
      fecha:new Date(1995,11,17),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:8,
      mensaje:"Mensaje 8",
      fecha:new Date(1995,11,18),
      usuario:0,
      fk_chat:1
    },{
      id_mensaje:9,
      mensaje:"Mensaje 9",
      fecha:new Date(1995,11,19),
      usuario:1,
      fk_chat:1
    },{
      id_mensaje:10,
      mensaje:"Mensaje 10",
      fecha:new Date(1995,11,20),
      usuario:0,
      fk_chat:1
    },
  ]*/

  msgs:any=[];
  datos:any=[];
  enviarForm: FormGroup;
  idChat:any=null;

  constructor(private chatService:ChatsService,private activatedRoute: ActivatedRoute,private fb:FormBuilder,) {
   }
  
  ngOnInit(): void {
    this.formEnviarInit()
    this.activatedRoute.params.subscribe(params => {
      this.idChat=params['id']
      this.chatService.verDatosChat(params['id']).subscribe(resultado=>{
        console.log(resultado)
        this.datos=resultado
      })
      this.chatService.verMensajesChat(params['id']).subscribe(resultado=>{
        this.msgs=resultado
      })
      this.chatService.cambiarEstadoNotificacion(params['id'])
    });
    
  }

  formEnviarInit(){
    this.enviarForm = this.fb.group({
      enviarInput:[],
    })
  }

  enviarMensaje(){
    let msg:string=this.enviarForm.get('enviarInput').value;
    if(msg.length>=10){
      this.chatService.enviarMensaje(this.idChat,msg).subscribe(res=>{
        this.chatService.verMensajesChat(this.idChat).subscribe(resultado=>{
          this.msgs=resultado
        })
        this.enviarForm.patchValue({enviarInput:''})
      })
    }else{
      window.alert("El mensaje debe de ser mayor a 10 caracteres")
    }
    
  }

  cancelar(){
    if (window.confirm("Está seguro de querer cancelar la conversación")) {
      let msg=this.enviarForm.get('enviarInput').value;
      this.chatService.cancelarChat(this.idChat,msg).subscribe(res=>{
        console.log(res)
        location.reload();
      })
    }
  }

  bloquear(){
    if (window.confirm("Está seguro de querer bloquear la conversación")) {
    let msg=this.enviarForm.get('enviarInput').value;
    this.chatService.bloquearChat(this.idChat,msg).subscribe(res=>{
      console.log(res)
      location.reload();
    })
  }
  }

  confirmarCompra(){
    if (window.confirm("Está seguro de querer confirmar la compra")) {
    this.chatService.confirmarCompra(this.idChat).subscribe(res=>{
      console.log(res)
      location.reload();
    })
  }
  }

}
