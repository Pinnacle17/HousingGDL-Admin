import { Component, OnInit,Input, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CasasService } from 'src/app/services/casas.service';
import { ChatsService } from 'src/app/services/chats.service';
import { CuartosService } from 'src/app/services/cuartos.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']

})
export class ChatComponent implements OnInit {
  @Input() childMessage: number;

  msgs:any=[];
  datos:any=[];
  enviarForm: FormGroup;
  idChat:any=null;
  casas:any=[];
  casa_id:any=null;
  cuartos:any=[];
  cuarto_id:any=null;
  ofertas:any=[];
  oferta_id:number=null;
  id_usuario:any=null

  @ViewChild('modalBloqueo', {static: false}) modalBloqueo;
  @ViewChild('cerrarModalBloqueo', {static: false}) cerrarModalBloqueo;

  constructor(
    private chatService:ChatsService,
    private activatedRoute: ActivatedRoute,
    private fb:FormBuilder,
    private casasService:CasasService,
    private cuartosService:CuartosService,
    ) {
   }

  ngOnInit(): void {
    this.formEnviarInit()
    this.activatedRoute.params.subscribe(params => {
      this.idChat=params['id']
      this.chatService.verDatosChat(params['id']).subscribe(resultado=>{
        console.log(resultado)
        this.datos=resultado
        this.id_usuario=this.datos.id_usuario
      })
      this.chatService.verMensajesChat(params['id']).subscribe(resultado=>{
        this.msgs=resultado
      })
    });

    this.casasService.getCasas().subscribe(resultado=>{
      console.log(resultado)
      this.casas=resultado
    })

  }

  getCasa(value){
    this.casa_id=value
    console.log(value)
    if(value!=''){
      this.cuartosService.getCuartos(this.casa_id).subscribe(resultado=>{
        console.log(resultado)
        this.cuartos=resultado
      })
    }else{
      this.casa_id=null
      this.cuartos=[]
      this.cuarto_id=null
      this.ofertas=[]
    }
  }

  getCuarto(value){
    this.cuarto_id=value
    console.log(value)
    if(value!=''){
      this.chatService.verOfertas(this.cuarto_id).subscribe(resultado=>{
        console.log(resultado)
        this.ofertas=resultado
      })
    }else{
      this.casa_id=null
      this.cuartos=[]
      this.cuarto_id=null
      this.ofertas=[]
    }

  }

  getOferta(value){
     this.oferta_id=value
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

  bloquear(msg){
    if (window.confirm("Está seguro de querer bloquear la conversación")) {
    let msg1=msg
    this.chatService.bloquearChat(this.idChat,msg1).subscribe(res=>{
      console.log(res)
      location.reload();
    })
  }
  }

  confirmarCompra(){
    if (window.confirm("Está seguro de querer confirmar la compra")) {
    this.chatService.confirmarCompra(this.id_usuario, this.oferta_id).subscribe(res=>{
      console.log(res)
      location.reload();
    })
    }
  }

}
