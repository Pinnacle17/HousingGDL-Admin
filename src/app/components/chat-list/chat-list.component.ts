import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatsService } from 'src/app/services/chats.service';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html'
})
export class ChatListComponent implements OnInit {


  formFiltros:FormGroup;

  users:any=[];
  haychat:boolean = false;

  constructor(private router: Router, private chatService:ChatsService,  private fb:FormBuilder) {}
  formFiltrosInit(){
    this.formFiltros = this.fb.group({
      estado:['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.chatService.verChatsNotificacion().subscribe( resultado => {
      console.log(resultado)
      if(resultado == null){
        this.haychat = false;
      }else{
        this.haychat = true;
        this.users=resultado;
      }

    });
    this.formFiltrosInit();
  }

  chatId=null;

  chat(id: number) {
    //this.router.navigate(['chat-list/chat', id]);
    console.log(id)
    this.chatId=id
    this.router.navigate(['chat', id])
  }

  receiveMessage($event) {
    this.chatId = $event
  }
  filtrar(){
    console.log(this.formFiltros.value);
    this.chatService.filtrarChat(this.formFiltros.value).subscribe( resultado => {
      if(resultado == 0){
        this.haychat = false;
        return
      }
      else{
        this.haychat = true;
        this.users = resultado;
      }
    })
}

}
