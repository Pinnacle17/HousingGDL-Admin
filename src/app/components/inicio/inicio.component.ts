import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { LoginService } from '../../services/login.service';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit, OnDestroy {

  recognition: SpeechRecognition;
  loggedIn:boolean = true;

  @ViewChild('modal', {static: false}) modal;
  @ViewChild('cerrarModalNotificacion', {static: false}) cerrarModalNotificacion;

  hayChats:any=false;
  casas:any=[];

  constructor(private router: Router, private ngZone: NgZone, private loginService: LoginService) {
  }

  initSpeech() {
    const SpeechRecognition = webkitSpeechRecognition;
    const SpeechGrammarList = webkitSpeechGrammarList;
    const SpeechRecognitionEvent = webkitSpeechRecognitionEvent;

    this.recognition = new SpeechRecognition();
    const speechRecognitionList: SpeechGrammarList = new SpeechGrammarList();

    speechRecognitionList.addFromString(`
      #JSGF V1.0;
      public navigate = ver (eventos | publicaciones | usuarios | repartidores);
      `, 1);

    this.recognition.grammars = speechRecognitionList;
    this.recognition.continuous = false;
    this.recognition.lang = 'es-MX';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    let navigate = false;
    this.recognition.onresult = ev => {
      const command = ev.results[0][0].transcript.split(' ');
      if (command.length >= 2) {

        this.ngZone.run(() => {
          switch (command[1]) {
            case 'casas':
              this.router.navigate(['casas']);
              navigate = true;
              break;
            case 'publicaciones':
              this.router.navigate(['publicaciones']);
              navigate = true;
              break;
            case 'usuarios':
              this.router.navigate(['usuarios']);
              navigate = true;
              break;
            case 'chats':
              this.router.navigate(['chat-list']);
              navigate = true;
              break;
          }
        });
      }
    };
    this.recognition.start();

    this.recognition.onend = () => {
      this.recognition.stop();
      if (navigate) {
        this.recognition.onresult = () => {
        };
      }
      this.recognition.start();
    };
  }

  ngOnDestroy() {
    this.recognition.onend = () => {
    };
    this.recognition.stop();
    this.recognition.onresult = () => {
    };
  }

  async ngOnInit() {
    this.loggedIn = this.loginService.getEstadoSesion();
    console.log(this.loggedIn);
    if (this.loggedIn == false  && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
    this.initSpeech();

    await this.loginService.verNotificacionChats().subscribe(resultado=>{
      console.log(resultado)
      this.hayChats=resultado;
    })
    await this.loginService.verNotificacionCalificacion().subscribe(resultado=>{
      console.log(resultado)
      this.casas=resultado;
    })
    
    if(this.hayChats!=false || this.casas!=null){
      this.modal.nativeElement.click();
    }
  }

  irCasa(id: number) {
    this.cerrarModalNotificacion.nativeElement.click();
    this.router.navigate(['editar-casa', id]);
  }
  
  irChats(){
    this.cerrarModalNotificacion.nativeElement.click();
    this.router.navigate(['chat-list']);
  }
}
