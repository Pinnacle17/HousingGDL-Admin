import {Component, OnInit, ElementRef, ViewChild, OnDestroy, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RxwebValidators} from '@rxweb/reactive-form-validators';
import {PublicacionesService} from '../../services/publicaciones.service';

declare var webkitSpeechRecognition;
declare var webkitSpeechGrammarList;
declare var webkitSpeechRecognitionEvent;

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html'
})
export class PublicacionesComponent implements OnInit, OnDestroy {

  formPublicaciones: FormGroup;

  urls = [];
  urlPrincipal = null;

  publicaciones = null;
  busqueda = null;

  encontrado: boolean = null;

  publicacion = {
    id_publicacion: null,
    titulo_pub: null,
    articulo_pub: null
  };

  imgSeleccionada: File;
  imgsSeleccionadas: File[] = [];
  listaImg: any[] = [];

  errorNombre: string = '';

  @ViewChild('imgInputP') imgInputP: ElementRef;
  @ViewChild('imgsInput') imgsInput: ElementRef;
  @ViewChild('cerrar') cerrar;

  recognition: SpeechRecognition;

  constructor(private router: Router,
              private fb: FormBuilder,
              private publicacionesService: PublicacionesService,
              private ngZone: NgZone
  ) {
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
                case 'eventos':
                  this.router.navigate(['eventos']);
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

            for (const e of this.publicaciones) {
              if (e.id_publicacion == +event) {
                navigate = true;
                this.ngZone.run(() => {
                  this.editarPublicacion(e.id_publicacion);
                });
                break;
              }
            }
            break;
          }
          case 'eliminar': {
            const event = command.slice(1, command.length).join(' ');

            for (const e of this.publicaciones) {
              if (e.id_publicacion == +event) {
                navigate = true;
                this.ngZone.run(() => {
                  this.eliminarPublicacion(e.id_publicacion);
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
    this.getPublicaciones();
    this.formPublicacionesInit();
  }

  formPublicacionesInit() {
    this.formPublicaciones = this.fb.group({
      titulo: ['', [Validators.required]],
      articulo: ['', [Validators.required]],
      imgPrincipal: ['', [Validators.required, RxwebValidators.image({minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096})]],
      imgsPublicacion: ['', [Validators.required, RxwebValidators.image({minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096})]]
    });
  }

  getPublicaciones() {
    this.publicacionesService.getPublicaciones().subscribe(resultado => this.publicaciones = resultado);
  }

  buscarPub(nombre: string) {
    if (nombre == null || nombre == '') {
      return null;
    } else {
      this.publicacionesService.buscarPub(nombre).subscribe(resultado => {
        if (resultado == null) {
          this.encontrado = false;
        } else {
          this.busqueda = resultado;
          this.encontrado = true;
        }

      });
    }
  }

  get validacionTitulo() {
    return this.formPublicaciones.get('titulo').invalid && this.formPublicaciones.get('titulo').touched;
  }

  get tituloExistente() {
    return this.formPublicaciones.get('titulo').invalid && this.formPublicaciones.get('titulo').value != '' && !this.formPublicaciones.get('titulo').pristine;
  }

  get validacionArticulo() {
    return this.formPublicaciones.get('articulo').invalid && this.formPublicaciones.get('articulo').touched;
  }

  get validacionImgPrincipal() {
    return this.formPublicaciones.get('imgPrincipal').invalid && this.formPublicaciones.get('imgPrincipal').touched && this.formPublicaciones.get('imgPrincipal').value == '';
  }

  get validacionImgs() {
    return this.formPublicaciones.get('imgsPublicacion').invalid && this.formPublicaciones.get('imgsPublicacion').touched && this.formPublicaciones.get('imgsPublicacion').value == '';
  }

  get validacionTamImg() {
    return this.formPublicaciones.get('imgPrincipal').invalid && this.formPublicaciones.get('imgPrincipal').dirty && this.formPublicaciones.get('imgPrincipal').value != '';
  }

  get validacionTamImgs() {
    return this.formPublicaciones.get('imgsPublicacion').invalid && this.formPublicaciones.get('imgsPublicacion').dirty && this.formPublicaciones.get('imgsPublicacion').value != '';
  }

  get nombreExistente() {
    return this.formPublicaciones.get('nombre').invalid && this.formPublicaciones.get('nombre').value != '' && !this.formPublicaciones.get('nombre').pristine;
  }

  multiImg(event) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {

        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);

        var selectedFile = event.target.files[i];
        this.imgsSeleccionadas.push(selectedFile);
        this.listaImg.push(selectedFile.name);
      }
    }

    this.formPublicaciones.controls['imgsPublicacion'].setValue(this.imgsSeleccionadas);
  }

  imgPrincipal(event) {
    this.imgSeleccionada = <File>event.target.files[0];
    this.formPublicaciones.controls['imgPrincipal'].setValue(this.imgSeleccionada);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        this.urlPrincipal = event.target.result;
      };
    }
  }

  borrarImgPrincipal() {
    this.urlPrincipal = null;
    this.formPublicaciones.controls['imgPrincipal'].setValue('');
    this.imgInputP.nativeElement.value = null;
  }

  borrarImgs(url: any, index: number) {
    this.urls = this.urls.filter((a) => a !== url);
    this.listaImg.splice(index, 1);
    this.imgsSeleccionadas.splice(index, 1);

    this.formPublicaciones.controls['imgsPublicacion'].reset();
    this.formPublicaciones.controls['imgsPublicacion'].setValue(this.imgsSeleccionadas);


    if (this.imgsSeleccionadas.length == 0) {
      this.formPublicaciones.controls['imgsPublicacion'].setValue('');
      this.imgsInput.nativeElement.value = null;
    }
  }

  editarPublicacion(id: number) {
    this.router.navigate(['editar-publicacion', id]);
  }

  eliminarPublicacion(id: number) {
    if (confirm('Está seguro de querer eliminar este evento?')) {
      this.publicacionesService.eliminarPublicacion(id).subscribe(datos => {
        if (datos['resultado'] == 'OK') {
          this.getPublicaciones();
        }
      });
    }
  }

  guardarPublicacion() {
    console.log(this.formPublicaciones);
    if (this.formPublicaciones.invalid) {
      Object.values(this.formPublicaciones.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAllAsTouched());
        } else {
          control.markAllAsTouched();
        }
      });
      return;
    } else {

      this.publicacionesService.buscarNombre(this.formPublicaciones.get('titulo').value).subscribe(datos => {
        if (datos['estado'] == 0) {
          this.errorNombre = datos['mensaje'];
          window.confirm(this.errorNombre);
          return;
        } else if (datos['estado'] == 1) {
          this.publicacionesService.crearPublicacion(this.formPublicaciones.value).subscribe(datos => {
            if (datos['resultado'] == 'OK') {
              this.getPublicaciones();
              this.formPublicaciones.reset();

              this.borrarImgPrincipal();

              this.urls = [];
              this.imgsInput.nativeElement.value = null;
              this.cerrar.nativeElement.click();
            } else {
              console.log('ERROR');
            }
          });
        }
      });
    }
  }
}
