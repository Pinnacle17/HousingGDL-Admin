import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {RepartidoresService} from '../../services/repartidores.service';
import {Router} from '@angular/router';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-repartidores',
  templateUrl: './repartidores.component.html'
})
export class RepartidoresComponent implements OnInit, OnDestroy {

  formRepartidor: FormGroup;

  repartidores: any = null;

  busqueda = null;

  encontrado: boolean = null;

  @ViewChild('cerrar') cerrar;

  recognition: SpeechRecognition;

  constructor(private fb: FormBuilder,
              private repartidoresService: RepartidoresService,
              private router: Router,
              private ngZone: NgZone) {
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
    this.getRepartidores();
    this.formInit();
  }

  formInit() {
    this.formRepartidor = this.fb.group({
      nombre: ['', Validators.required],
      apellidoP: ['', Validators.required],
      apellidoM: ['', Validators.required],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      telefono: ['', [Validators.required]],
      telefonoExt: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      contra: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$')]],
      contra2: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$')]],
    });
  }

  get validacionNombre() {
    return this.formRepartidor.get('nombre').invalid && this.formRepartidor.get('nombre').touched;
  }

  get validacionApellidoP() {
    return this.formRepartidor.get('apellidoP').invalid && this.formRepartidor.get('apellidoP').touched;
  }

  get validacionApellidoM() {
    return this.formRepartidor.get('apellidoM').invalid && this.formRepartidor.get('apellidoM').touched;
  }

  get validacionCorreo() {
    return this.formRepartidor.get('correo').invalid && this.formRepartidor.get('correo').touched;
  }

  get validacionNacimiento() {
    return this.formRepartidor.get('fechaNacimiento').invalid && this.formRepartidor.get('fechaNacimiento').touched;
  }

  get validacionTelefono() {
    return this.formRepartidor.get('telefono').invalid && this.formRepartidor.get('telefono').touched;
  }

  get validacionTelefonoExtra() {
    return this.formRepartidor.get('telefonoExt').invalid && this.formRepartidor.get('telefonoExt').touched;
  }

  get validacionNumero() {
    return this.esAlfa(this.formRepartidor.get('telefono').value) && this.formRepartidor.get('telefono').value != '';
  }

  get validacionNumeroExtra() {
    return this.esAlfa(this.formRepartidor.get('telefonoExt').value) && this.formRepartidor.get('telefonoExt').value != '';
  }

  get validacionContra() {
    return this.formRepartidor.get('contra').invalid && this.formRepartidor.get('contra').touched;
  }

  esAlfa(str) {
    if (str != null) {
      if (!str.match(/^[0-9]+$/)) {
        return true;
      } else {
        return false;
      }
    }
  }

  passNoValida() {
    const P1 = this.formRepartidor.get('contra').value;
    const P2 = this.formRepartidor.get('contra2').value;

    if (P1 === P2) {
      return false;
    } else {
      this.formRepartidor.get('contra2').setErrors({'invalid': true});
      return true;
    }
  }


  getRepartidores() {
    this.repartidoresService.getRepartidores().subscribe(resultado => this.repartidores = resultado);
  }

  editarReapartidor(id_repartidor: number) {
    this.router.navigate(['editar-repartidor', id_repartidor]);
  }

  eliminarRepartidor(id_repartidor: number) {
    if (confirm('Está seguro de querer eliminar a este repartidor?')) {
      this.repartidoresService.eliminarRepartidor(id_repartidor).subscribe(datos => {
        if (datos['resultado'] == 'OK') {
          this.getRepartidores();
        }
      });
    }
  }

  buscarRepartidor(nombre: string) {
    if (nombre == null || nombre == '') {
      return null;
    } else {
      this.repartidoresService.buscarRepartidor(nombre).subscribe(resultado => {
        if (resultado == null) {
          this.encontrado = false;
        } else {
          this.busqueda = resultado;
          this.encontrado = true;
        }

      });
    }
  }

  guardarRepartidor() {
    if (this.formRepartidor.invalid) {
      Object.values(this.formRepartidor.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAllAsTouched());
        } else {
          control.markAllAsTouched();
        }
      });
      return;
    } else {

      let nombre = this.formRepartidor.get('nombre').value;
      let apellidoP = this.formRepartidor.get('apellidoP').value;
      let apellidoM = this.formRepartidor.get('apellidoM').value;

      this.formRepartidor.controls['nombre'].setValue(nombre + ' ' + apellidoP + ' ' + apellidoM);

      this.repartidoresService.crearRepartidor(this.formRepartidor.value).subscribe(datos => {
        if (datos['resultado'] == 'ERROR') {
          console.log('ERROR');
          return;
        } else if (datos['resultado'] == 'OK') {
          this.getRepartidores();
          this.formRepartidor.reset();

          this.cerrar.nativeElement.click();
        }
      });
    }
  }

}
