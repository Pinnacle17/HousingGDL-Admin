import { Component, OnInit,Input  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  @Input() childMessage: number;

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
      this.chatService.cambiarEstadoNotificacion(params['id']).subscribe(resultado=>{
        console.log(resultado);
      })

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
