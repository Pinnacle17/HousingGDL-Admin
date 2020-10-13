import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {EventosService} from '../../services/eventos.service';
import {RxwebValidators} from '@rxweb/reactive-form-validators';
import {ViewChild, ElementRef} from '@angular/core';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html'
})
export class EventosComponent implements OnInit, OnDestroy {

  formEventos: FormGroup;

  urls = [];
  urlPrincipal = null;
  urlCarousel = null;

  eventos = null;

  busqueda = null;
  encontrado: boolean = null;

  imgSeleccionada: File;
  imgCarouselSeleccionada: File;
  imgsSeleccionadas: File[] = [];
  listaImg: any[] = [];

  mensajeError: string = '';
  errorOrden: string = '';
  errorNombre: string = '';

  recognition: SpeechRecognition;

  @ViewChild('imgInputP') imgInputP: ElementRef;
  @ViewChild('imgInputC') imgInputC: ElementRef;
  @ViewChild('imgsInput') imgsInput: ElementRef;
  @ViewChild('cerrar') cerrar;
  @ViewChild('modalError') modalError;
  @ViewChild('cerrarModalError') cerrarModalError;

  constructor(private fb: FormBuilder,
              private router: Router,
              private eventosService: EventosService,
              private ngZone: NgZone) {
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
      public navigate = ver (eventos | publicaciones | usuarios | repartidores);
      public editar = editar;
      public eliminar = eliminar;
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
                case 'repartidores':
                  this.router.navigate(['repartidores']);
                  navigate = true;
                  break;
              }
            });
            break;
          case 'editar': {
            const event = command.slice(1, command.length).join(' ');

            for (const e of this.eventos) {
              if (e.id_evento == event) {
                navigate = true;
                this.ngZone.run(() => {
                  this.editarEvento(e.id_evento);
                });
                break;
              }
            }
            break;
          }
          case 'eliminar': {
            const event = command.slice(1, command.length).join(' ');

            for (const e of this.eventos) {
              if (e.id_evento == event) {
                navigate = true;
                this.ngZone.run(() => {
                  this.eliminarEvento(e.id_evento);
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

  ngOnInit() {
    this.initSpeech();
    this.getEventos();
    this.formInit();
  }

  getEventos() {
    this.eventosService.getEventos().subscribe(resultado => this.eventos = resultado);
  }

  buscarEvento(nombre: string) {
    if (nombre == null || nombre == '') {
      return null;
    } else {
      this.eventosService.buscarEvento(nombre).subscribe(resultado => {
        if (resultado == null) {
          this.encontrado = false;
        } else {
          this.busqueda = resultado;
          this.encontrado = true;
        }
      });
    }
  }

  eliminarEvento(id: number) {
    if (confirm('Está seguro de querer eliminar este evento?')) {
      this.eventosService.buscarBoletos(id).subscribe(res => {
        if(res == 0){
          window.confirm("El evento tiene boletos. No es posible eliminar el evento.");
          return
        }
        else{
          this.eventosService.eliminarEvento(id).subscribe(datos => {
            if (datos['resultado'] == 'OK') {
              this.getEventos();
            }
          });
        }
      })
    }
  }

  cancelarEvento(id_evento:number){
    if (confirm('Está seguro de querer cancelar este evento?')) {
      this.eventosService.cancelarEvento(id_evento).subscribe(() => {
        this.getEventos();
      })
    }
  }

  formInit() {
    this.formEventos = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha: this.fb.group({
        inicio: ['', [Validators.required]],
        cierre: ['', [Validators.required]],
      }),
      horario: this.fb.group({
        inicio: ['', [Validators.required]],
        cierre: ['', [Validators.required]],
      }),
      tipo: ['', [Validators.required]],
      enlace: ['', Validators.required],
      desc: ['', [Validators.required]],
      orden: ['', Validators.required],
      imgPrincipal: ['', [Validators.required, RxwebValidators.image({minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096})]],
      imgCarousel: ['', [Validators.required, RxwebValidators.image({minWidth: 1250, maxWidth: 4096, minHeight: 690, maxHeight: 2160})]],
      imgsEvento: ['', [Validators.required, RxwebValidators.image({minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096})]]
    });
  }

  editarEvento(id: number) {
    this.router.navigate(['editar-evento', id]);
  }

  compararFechas() {
    let inicio = new Date(this.formEventos.get('fecha.inicio').value);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset());

    let cierre = new Date(this.formEventos.get('fecha.cierre').value);
    cierre.setMinutes(cierre.getMinutes() + cierre.getTimezoneOffset());

    let hoy = new Date();
    hoy.setSeconds(0);
    hoy.setMinutes(0);
    hoy.setHours(0);

    if (inicio > cierre) {
      this.mensajeError = 'El evento no puede terminar antes de empezar.';
      this.formEventos.get('fecha').setErrors({'incorrect': true});
      return true;
    } else if (hoy > inicio) {
      this.mensajeError = 'El evento no puede empezar hoy o antes de hoy.';
      this.formEventos.get('fecha').setErrors({'incorrect': true});
      return true;
    } else if (hoy > cierre) {
      this.mensajeError = 'El evento no puede terminar hoy o antes de hoy.';
      this.formEventos.get('fecha').setErrors({'incorrect': true});
      return true;
    } else {
      return false;
    }
  }

  compararHorarios() {
    let inicio = new Date(this.formEventos.get('fecha.inicio').value);
    let cierre = new Date(this.formEventos.get('fecha.cierre').value);


    if ((inicio.getTime() === cierre.getTime()) && this.formEventos.get('horario').dirty) {

      let horarioInicio = this.formEventos.get('horario.inicio');
      let horarioCierre = this.formEventos.get('horario.cierre');

      if ((horarioInicio.value >= horarioCierre.value) && (horarioInicio.dirty && horarioCierre.dirty)) {
        this.formEventos.get('horario').setErrors({'incorrect': true});
        return true;
      } else {
        return false;
      }
    }
  }

  get validacionNombre() {
    return this.formEventos.get('nombre').invalid && this.formEventos.get('nombre').touched;
  }

  get nombreExistente() {
    return this.formEventos.get('nombre').invalid && this.formEventos.get('nombre').value != '' && !this.formEventos.get('nombre').pristine;
  }

  get validacionFechaInicio() {
    return this.formEventos.get('fecha.inicio').invalid && this.formEventos.get('fecha.inicio').touched;
  }

  get validacionFechaCierre() {
    return this.formEventos.get('fecha.cierre').invalid && this.formEventos.get('fecha.cierre').touched;
  }

  get validacionHorarioInicio() {
    return this.formEventos.get('horario.inicio').invalid && this.formEventos.get('horario.inicio').touched;
  }

  get validacionHorarioCierre() {
    return this.formEventos.get('horario.cierre').invalid && this.formEventos.get('horario.cierre').touched;
  }

  get validacionTipo() {
    return this.formEventos.get('tipo').invalid && this.formEventos.get('tipo').touched;
  }

  get validacionEnlace() {
    return this.formEventos.get('enlace').invalid && this.formEventos.get('enlace').touched;
  }

  get validacionDesc() {
    return this.formEventos.get('desc').invalid && this.formEventos.get('desc').touched;
  }

  get validacionImg() {
    return this.formEventos.get('imgPrincipal').invalid && this.formEventos.get('imgPrincipal').touched && this.formEventos.get('imgPrincipal').value == '';
  }

  get validacionImgCarousel() {
    return this.formEventos.get('imgCarousel').invalid && this.formEventos.get('imgCarousel').touched && this.formEventos.get('imgCarousel').value == '';
  }

  get validacionImgs() {
    return this.formEventos.get('imgsEvento').invalid && this.formEventos.get('imgsEvento').touched && this.formEventos.get('imgsEvento').value == '';
  }

  get validacionTamImg() {
    return this.formEventos.get('imgPrincipal').invalid && this.formEventos.get('imgPrincipal').dirty && this.formEventos.get('imgPrincipal').value != '';
  }

  get validacionTamImgCarousel() {
    return this.formEventos.get('imgCarousel').invalid && this.formEventos.get('imgCarousel').dirty && this.formEventos.get('imgCarousel').value != '';
  }

  get validacionTamImgs() {
    return this.formEventos.get('imgsEvento').invalid && this.formEventos.get('imgsEvento').dirty && this.formEventos.get('imgsEvento').value != '';
  }

  get validacionOrden() {
    return this.formEventos.get('orden').invalid && this.formEventos.get('orden').touched;
  }

  imgPrincipal(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgSeleccionada = <File>event.target.files[0];
      this.formEventos.controls['imgPrincipal'].setValue(this.imgSeleccionada);

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        this.urlPrincipal = event.target.result;
      };
    }
  }

  imgCarousel(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgCarouselSeleccionada = <File>event.target.files[0];
      this.formEventos.controls['imgCarousel'].setValue(this.imgCarouselSeleccionada);

      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        this.urlCarousel = event.target.result;
      };
    }
  }

  multiImg(event) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        };

        var selectedFile = event.target.files[i];
        this.imgsSeleccionadas.push(selectedFile);
      }
      this.formEventos.controls['imgsEvento'].setValue(this.imgsSeleccionadas);
    }
  }

  borrarImgPrincipal() {
    this.urlPrincipal = null;
    this.formEventos.controls['imgPrincipal'].setValue('');
    this.imgInputP.nativeElement.value = null;
  }

  borrarImgCarousel() {
    this.urlCarousel = null;
    this.formEventos.controls['imgCarousel'].setValue('');
    this.imgInputC.nativeElement.value = null;
  }

  borrarImgs(url: any, index: number) {
    this.urls = this.urls.filter((a) => a !== url);
    this.imgsSeleccionadas.splice(index, 1);

    this.formEventos.controls['imgsEvento'].reset();
    this.formEventos.controls['imgsEvento'].setErrors(null);

    if (this.imgsSeleccionadas.length == 0) {
      this.formEventos.controls['imgsEvento'].setValue(null);
      this.imgsInput.nativeElement.value = null;
    }

  }

  liberarLugar() {
    this.eventosService.liberarLugar(this.formEventos.get('orden').value).subscribe(datos => {
      if (datos['resultado'] == 'ERROR') {
        console.log('ERROR');
        return;
      } else if (datos['resultado'] == 'OK') {
        window.confirm('Lugar liberado con exito');
        this.cerrarModalError.nativeElement.click();
      }
    });
  }

  guardarEvento() {
    this.eventosService.buscarNombre(this.formEventos.get('nombre').value).subscribe(datos => {
      if (datos['estado'] == 0) {
        this.errorNombre = datos['mensaje'];
        window.confirm(this.errorNombre);
        this.formEventos.get('nombre').setErrors({'incorrect': true});
      } else if (datos['estado'] == 1) {
        this.eventosService.buscarLugar(this.formEventos.get('orden').value).subscribe(datos => {
          if (datos['estado'] == 0) {
            this.errorOrden = datos['mensaje'];
            this.modalError.nativeElement.click();
          } else if (datos['estado'] == 1) {
            this.eventosService.crearEvento(this.formEventos.value).subscribe(datos => {
              if (datos['resultado'] == 'OK') {
                this.getEventos();
                this.formEventos.reset();

                this.borrarImgPrincipal();

                this.borrarImgCarousel();

                this.urls = [];
                this.imgsInput.nativeElement.value = null;
                this.cerrar.nativeElement.click();
              }
            });
          }
        });
      }
    });
  }
}
