import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit, OnDestroy {

  recognition: SpeechRecognition;

  constructor(private router: Router, private ngZone: NgZone) {
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
              this.router.navigate(['eventos']);
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
            case 'repartidores':
              this.router.navigate(['repartidores']);
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

  ngOnInit() {
    this.initSpeech();
  }

}
