import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CasasService} from '../../services/casas.service';
import {RxwebValidators} from '@rxweb/reactive-form-validators';
import {ViewChild, ElementRef} from '@angular/core';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-casas',
  templateUrl: './casas.component.html'
})
export class CasasComponent implements OnInit, OnDestroy {

  formCasas: FormGroup;

  urls = [];
  urlPrincipal = null;
  urlCarousel = null;

  casas = null;

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
              private casasService: CasasService,
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
      public navigate = ver (casas | publicaciones | usuarios | repartidores);
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

            for (const e of this.casas) {
              if (e.id_casa == event) {
                navigate = true;
                this.ngZone.run(() => {
                  this.editarCasa(e.id_casa);
                });
                break;
              }
            }
            break;
          }
          case 'eliminar': {
            const event = command.slice(1, command.length).join(' ');

            for (const e of this.casas) {
              if (e.id_casa == event) {
                navigate = true;
                this.ngZone.run(() => {
                  this.eliminarCasa(e.id_casa);
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
    this.getCasas();
    this.formInit();
  }

  getCasas() {
    this.casasService.getCasas().subscribe(resultado => this.casas = resultado);
  }

  buscarCasa(nombre: string) {
    if (nombre == null || nombre == '') {
      return null;
    } else {
      this.casasService.buscarCasa(nombre).subscribe(resultado => {
        if (resultado == null) {
          this.encontrado = false;
        } else {
          this.busqueda = resultado;
          this.encontrado = true;
        }
      });
    }
  }

  eliminarCasa(id: number) {
    if (confirm('Está seguro de querer eliminar este casa?')) {
      this.casasService.buscarBoletos(id).subscribe(res => {
        if(res == 0){
          window.confirm("El casa tiene boletos. No es posible eliminar el casa.");
          return
        }
        else{
          this.casasService.eliminarCasa(id).subscribe(datos => {
            if (datos['resultado'] == 'OK') {
              this.getCasas();
            }
          });
        }
      })
    }
  }

  cancelarCasa(id_casa:number){
    if (confirm('Está seguro de querer cancelar este casa?')) {
      this.casasService.cancelarCasa(id_casa).subscribe(() => {
        this.getCasas();
      })
    }
  }

  formInit() {
    this.formCasas = this.fb.group({
      nombre: ['', [Validators.required]],
      ambiente: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      orden: ['', Validators.required],
      imgPrincipal: ['', [Validators.required, RxwebValidators.image({minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096})]],
      imgCarousel: ['', [Validators.required, RxwebValidators.image({minWidth: 1250, maxWidth: 4096, minHeight: 690, maxHeight: 2160})]],
      imgsCasa: ['', [Validators.required, RxwebValidators.image({minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096})]]
    });
  }

  editarCasa(id: number) {
    this.router.navigate(['editar-casa', id]);
  }

  compararFechas() {
    let inicio = new Date(this.formCasas.get('fecha.inicio').value);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset());

    let cierre = new Date(this.formCasas.get('fecha.cierre').value);
    cierre.setMinutes(cierre.getMinutes() + cierre.getTimezoneOffset());

    let hoy = new Date();
    hoy.setSeconds(0);
    hoy.setMinutes(0);
    hoy.setHours(0);

    if (inicio > cierre) {
      this.mensajeError = 'El casa no puede terminar antes de empezar.';
      this.formCasas.get('fecha').setErrors({'incorrect': true});
      return true;
    } else if (hoy > inicio) {
      this.mensajeError = 'El casa no puede empezar hoy o antes de hoy.';
      this.formCasas.get('fecha').setErrors({'incorrect': true});
      return true;
    } else if (hoy > cierre) {
      this.mensajeError = 'El casa no puede terminar hoy o antes de hoy.';
      this.formCasas.get('fecha').setErrors({'incorrect': true});
      return true;
    } else {
      return false;
    }
  }

  compararHorarios() {
    let inicio = new Date(this.formCasas.get('fecha.inicio').value);
    let cierre = new Date(this.formCasas.get('fecha.cierre').value);


    if ((inicio.getTime() === cierre.getTime()) && this.formCasas.get('horario').dirty) {

      let horarioInicio = this.formCasas.get('horario.inicio');
      let horarioCierre = this.formCasas.get('horario.cierre');

      if ((horarioInicio.value >= horarioCierre.value) && (horarioInicio.dirty && horarioCierre.dirty)) {
        this.formCasas.get('horario').setErrors({'incorrect': true});
        return true;
      } else {
        return false;
      }
    }
  }

  get validacionNombre() {
    return this.formCasas.get('nombre').invalid && this.formCasas.get('nombre').touched;
  }

  get nombreExistente() {
    return this.formCasas.get('nombre').invalid && this.formCasas.get('nombre').value != '' && !this.formCasas.get('nombre').pristine;
  }

  get validacionFechaInicio() {
    return this.formCasas.get('fecha.inicio').invalid && this.formCasas.get('fecha.inicio').touched;
  }

  get validacionFechaCierre() {
    return this.formCasas.get('fecha.cierre').invalid && this.formCasas.get('fecha.cierre').touched;
  }

  get validacionHorarioInicio() {
    return this.formCasas.get('horario.inicio').invalid && this.formCasas.get('horario.inicio').touched;
  }

  get validacionHorarioCierre() {
    return this.formCasas.get('horario.cierre').invalid && this.formCasas.get('horario.cierre').touched;
  }

  get validacionAmbiente() {
    return this.formCasas.get('ambiente').invalid && this.formCasas.get('ambiente').touched;
  }

  get validacionEnlace() {
    return this.formCasas.get('enlace').invalid && this.formCasas.get('enlace').touched;
  }

  get validacionDesc() {
    return this.formCasas.get('desc').invalid && this.formCasas.get('desc').touched;
  }

  get validacionImg() {
    return this.formCasas.get('imgPrincipal').invalid && this.formCasas.get('imgPrincipal').touched && this.formCasas.get('imgPrincipal').value == '';
  }

  get validacionImgCarousel() {
    return this.formCasas.get('imgCarousel').invalid && this.formCasas.get('imgCarousel').touched && this.formCasas.get('imgCarousel').value == '';
  }

  get validacionImgs() {
    return this.formCasas.get('imgsCasa').invalid && this.formCasas.get('imgsCasa').touched && this.formCasas.get('imgsCasa').value == '';
  }

  get validacionTamImg() {
    return this.formCasas.get('imgPrincipal').invalid && this.formCasas.get('imgPrincipal').dirty && this.formCasas.get('imgPrincipal').value != '';
  }

  get validacionTamImgCarousel() {
    return this.formCasas.get('imgCarousel').invalid && this.formCasas.get('imgCarousel').dirty && this.formCasas.get('imgCarousel').value != '';
  }

  get validacionTamImgs() {
    return this.formCasas.get('imgsCasa').invalid && this.formCasas.get('imgsCasa').dirty && this.formCasas.get('imgsCasa').value != '';
  }

  get validacionOrden() {
    return this.formCasas.get('orden').invalid && this.formCasas.get('orden').touched;
  }

  imgPrincipal(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgSeleccionada = <File>event.target.files[0];
      this.formCasas.controls['imgPrincipal'].setValue(this.imgSeleccionada);

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
      this.formCasas.controls['imgCarousel'].setValue(this.imgCarouselSeleccionada);

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
      this.formCasas.controls['imgsCasa'].setValue(this.imgsSeleccionadas);
    }
  }

  borrarImgPrincipal() {
    this.urlPrincipal = null;
    this.formCasas.controls['imgPrincipal'].setValue('');
    this.imgInputP.nativeElement.value = null;
  }

  borrarImgCarousel() {
    this.urlCarousel = null;
    this.formCasas.controls['imgCarousel'].setValue('');
    this.imgInputC.nativeElement.value = null;
  }

  borrarImgs(url: any, index: number) {
    this.urls = this.urls.filter((a) => a !== url);
    this.imgsSeleccionadas.splice(index, 1);

    this.formCasas.controls['imgsCasa'].reset();
    this.formCasas.controls['imgsCasa'].setErrors(null);

    if (this.imgsSeleccionadas.length == 0) {
      this.formCasas.controls['imgsCasa'].setValue(null);
      this.imgsInput.nativeElement.value = null;
    }

  }

  liberarLugar() {
    this.casasService.liberarLugar(this.formCasas.get('orden').value).subscribe(datos => {
      if (datos['resultado'] == 'ERROR') {
        console.log('ERROR');
        return;
      } else if (datos['resultado'] == 'OK') {
        window.confirm('Lugar liberado con exito');
        this.cerrarModalError.nativeElement.click();
      }
    });
  }

  guardarCasa() {
    this.casasService.buscarNombre(this.formCasas.get('nombre').value).subscribe(datos => {
      if (datos['estado'] == 0) {
        this.errorNombre = datos['mensaje'];
        window.confirm(this.errorNombre);
        this.formCasas.get('nombre').setErrors({'incorrect': true});
      } else if (datos['estado'] == 1) {
        this.casasService.buscarLugar(this.formCasas.get('orden').value).subscribe(datos => {
          if (datos['estado'] == 0) {
            this.errorOrden = datos['mensaje'];
            this.modalError.nativeElement.click();
          } else if (datos['estado'] == 1) {
            this.casasService.crearCasa(this.formCasas.value).subscribe(datos => {
              if (datos['resultado'] == 'OK') {
                this.getCasas();
                this.formCasas.reset();

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
