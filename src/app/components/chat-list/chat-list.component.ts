import { Component, OnInit, OnDestroy, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { ChatsService } from 'src/app/services/chats.service';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { LoginService } from '../../services/login.service';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']

})
export class ChatListComponent implements OnInit, OnDestroy {


  formFiltros:FormGroup;

  users:any=[];
  haychat:boolean = false;
  recognition: SpeechRecognition;

  loggedIn:boolean = false;



  constructor(private router: Router, private chatService:ChatsService,  private fb:FormBuilder, private ngZone: NgZone,
    private loginService: LoginService) {}
  formFiltrosInit(){
    this.formFiltros = this.fb.group({
      estado:['', [Validators.required]]
    });
  }

  ngOnDestroy() {
    this.recognition.onend = () => {
    };
    this.recognition.onresult = () => {
    };

    this.recognition.abort();
    this.recognition = null;
  }

  initSpeech() {
    const SpeechRecognition = webkitSpeechRecognition;
    const SpeechGrammarList = webkitSpeechGrammarList;
    const SpeechRecognitionEvent = webkitSpeechRecognitionEvent;

    this.recognition = new SpeechRecognition();
    const speechRecognitionList: SpeechGrammarList = new SpeechGrammarList();

    speechRecognitionList.addFromString(`
      #JSGF V1.0;
      public navigate = ver (casas | publicaciones | usuarios | chats);
      public mostrar = mostrar;
      `, 1);

    this.recognition.grammars = speechRecognitionList;
    this.recognition.continuous = false;
    this.recognition.lang = 'es-MX';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    let navigate = false;
    this.recognition.onresult = ev => {
      if (navigate) {
        return;
      }
      const command = ev.results[0][0].transcript.split(' ');
      if (command.length >= 2) {

        switch (command[0]) {
          case 'ver':
            this.ngZone.run(() => {

              switch (command[1]) {
                case 'publicaciones':
                  this.router.navigate(['publicaciones']);
                  navigate = true;
                  break;
                case 'usuarios':
                  this.router.navigate(['usuarios']);
                  navigate = true;
                  break;
                case 'casas':
                  this.router.navigate(['casas']);
                  navigate = true;
                  break;
              }
            });
            break;
          case 'mostrar': {
            const event = command.slice(1, command.length).join(' ');

            for (const e of this.users) {
              if (e.id_chat == event) {
                navigate = true;
                this.ngZone.run(() => {
                  this.chat(e.id_chat);
                });
                break;
              }
            }
            break;
          }
        }

      }

    };
    this.recognition.start();

    this.recognition.onend = () => {
      this.recognition.stop();
      if (navigate) {
        this.recognition.onresult = () => {
        };
        return;
      }
      this.recognition.start();
    };
  }

  ngOnInit(): void {
    this.loggedIn = this.loginService.getEstadoSesion();
    if (this.loggedIn == false && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
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
    this.initSpeech();
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
