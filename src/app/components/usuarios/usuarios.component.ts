import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {UsuariosService} from '../../services/usuarios.service';
import {Router} from '@angular/router';
import { LoginService } from '../../services/login.service';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, OnDestroy {

  usuarios = null;
  busqueda = null;

  encontrado: boolean = null;
  loggedIn:boolean = false;

  recognition: SpeechRecognition;

  usuario = {
    id_usuario: null,
    nombre: null,
    correo: null
  };

  constructor(private usuariosService: UsuariosService, private router: Router, private ngZone: NgZone, private loginService: LoginService) {
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
                case 'casas':
                  this.router.navigate(['casas']);
                  navigate = true;
                  break;
                case 'usuarios':
                  this.router.navigate(['usuarios']);
                  navigate = true;
                  break;
                case 'chats':
                case 'chat':
                  this.router.navigate(['chat-list']);
                  navigate = true;
                  break;
              }
            });
            break;
        }

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
    this.recognition.onresult = () => {
    };

    this.recognition.abort();
    this.recognition = null;
  }

  ngOnInit() {
    this.loggedIn = this.loginService.getEstadoSesion();
    if (this.loggedIn == false && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
    this.initSpeech();
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe(resultado => this.usuarios = resultado);
  }

  buscarUsuario(nombre: string) {
    if (nombre == null || nombre == '') {
      return null;
    } else {
      this.usuariosService.buscarUsuario(nombre).subscribe(resultado => {
        if (resultado == null) {
          this.encontrado = false;
        } else {
          this.busqueda = resultado;
          this.encontrado = true;
        }

      });
    }
  }

  activarUsuario(id: number) {
    if (confirm('Está seguro de querer activar a este usuario?')) {
      this.usuariosService.activarUsuario(id).subscribe(datos => {
        if (datos == true) {
          this.getUsuarios();
        }
      });
    }
  }

  verUsuario(id:number){
    this.router.navigate(['ver-usuario', id])
  }
}
