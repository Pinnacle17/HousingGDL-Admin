import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {UsuariosService} from '../../services/usuarios.service';
import {Router} from '@angular/router';

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

  recognition: SpeechRecognition;

  usuario = {
    id_usuario: null,
    nombre: null,
    correo: null
  };

  constructor(private usuariosService: UsuariosService, private router: Router, private ngZone: NgZone) {
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
            case 'eventos':
              this.router.navigate(['/eventos']);
              navigate = true;
              break;
            case 'publicaciones':
              this.router.navigate(['/publicaciones']);
              navigate = true;
              break;
            case 'repartidores':
              this.router.navigate(['/repartidores']);
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
    this.recognition.onresult = () => {
    };

    this.recognition.abort();
    this.recognition = null;
  }

  ngOnInit() {
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

  eliminarUsuario(id: number) {
    if (confirm('Está seguro de querer eliminar a este usuario?')) {
      this.usuariosService.eliminarUsuario(id).subscribe(datos => {
        if (datos['resultado'] == 'OK') {
          this.getUsuarios();
        }
      });
    }
  }

  verUsuario(id:number){
    this.router.navigate(['ver-usuario', id])
  }
}
