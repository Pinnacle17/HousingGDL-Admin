import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CasasService } from '../../services/casas.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ViewChild, ElementRef } from '@angular/core';

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
  badUrls = [];
  urlPrincipal = null;
  urlCarousel = null;

  casas = null;
  colonias = null

  busqueda = null;
  encontrado: boolean = null;
  cantidadimagenes:number = 0;

  imgSeleccionada: File;
  imgCarouselSeleccionada: File;
  imgsSeleccionadas: File[] = [];
  listaImg: any[] = [];

  mensajeError: string = '';
  errorOrden: string = '';
  errorNombre: string = '';
  sinImagen: boolean = false;
  errorTamImgs: boolean = false;

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
      public navigate = ver (casas | publicaciones | usuarios | chats);
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
                case 'chats':
                  this.router.navigate(['chat-list']);
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
              if (e.id_casa == +event) {
                navigate = true;
                this.ngZone.run(() => {
                  if(e.estado_casa=='Inactiva'){
                    this.activarCasa(e.id_casa);
                  }else{
                    this.cancelarCasa(e.id_casa);
                  }

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
    this.casasService.getCasas().subscribe(resultado => {this.casas = resultado});
    this.casasService.getColonias().subscribe(r=>{
      this.colonias=r;
      console.log(this.colonias)
    })
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

  activarCasa(id_casa: number) {
    if (confirm('Está seguro de querer activar esta casa?')) {
      this.casasService.activarCasa(id_casa).subscribe(()=>this.getCasas())

    }
  }

  cancelarCasa(id_casa: number) {
    if (confirm('Está seguro de querer cancelar este casa?')) {
      this.casasService.cancelarCasa(id_casa).subscribe(() => {
        this.getCasas();
      })
    }
  }

  formInit() {
    this.formCasas = this.fb.group({
      nombre_casa: ['', [Validators.required]],
      direccion_casa: ['', [Validators.required]],
      ambiente: ['', [Validators.required]],
      descripcion_casa: ['', [Validators.required]],
      orden_anuncio: ['', Validators.required],
      id_colonia: ['', Validators.required],
      imgPrincipal: ['', [Validators.required, RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })]],
      imgCarousel: ['', [Validators.required, RxwebValidators.image({ minWidth: 1250, maxWidth: 4096, minHeight: 690, maxHeight: 2160 })]],
      imgsCasa: ['', Validators.required]
    });
  }

  editarCasa(id: number) {
    this.router.navigate(['editar-casa', id]);
  }



  get validacionNombre() {
    return this.formCasas.get('nombre_casa').invalid && this.formCasas.get('nombre_casa').touched;
  }

  get nombreExistente() {
    return this.formCasas.get('nombre_casa').invalid && this.formCasas.get('nombre_casa').value != '' && !this.formCasas.get('nombre_casa').pristine;
  }


  get validacionAmbiente() {
    return this.formCasas.get('ambiente').invalid && this.formCasas.get('ambiente').touched;
  }

  get validacionDireccion() {
    return this.formCasas.get('direccion_casa').invalid && this.formCasas.get('direccion_casa').touched;
  }

  get validacionDesc() {
    return this.formCasas.get('descripcion_casa').invalid && this.formCasas.get('descripcion_casa').touched;
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
    return this.formCasas.get('orden_anuncio').invalid && this.formCasas.get('orden_anuncio').touched;
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
    if(event.target.files && event.target.files.length) {

      for (let i = 0; i < event.target.files.length; i++) {
        let img = new Image();
        var reader = new FileReader();
        let file = event.target.files[i];

        img.src = window.URL.createObjectURL(file);
        reader.readAsDataURL(event.target.files[i]);

        reader.onload = (event) => {
          const alto = img.naturalHeight;
          const ancho = img.naturalWidth;
          console.log(ancho);
          console.log(alto);
          window.URL.revokeObjectURL(file);
          if(alto < 690 || alto > 2160 || ancho < 950 ||ancho > 4096){
            this.errorTamImgs = true;
            this.badUrls.push(file.name);
          }
          else{
            this.urls.push(event.target.result);
            this.imgsSeleccionadas.push(file);
            this.listaImg.push(file.name);
            this.formCasas.controls['imgsCasa'].setValue(this.imgsSeleccionadas);
            this.cantidadimagenes = this.cantidadimagenes + 1;
          }
        };

      }
      this.sinImagen = false;
    }
    else{
      this.sinImagen = true;
      return
    }
    console.log(this.formCasas.get('imgsCasa').value);
    console.log(this.formCasas);

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
    this.cantidadimagenes = this.cantidadimagenes - 1;

  }

  liberarLugar() {
    this.casasService.liberarLugar(this.formCasas.get('orden_anuncio').value).subscribe(datos => {
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
    this.casasService.buscarLugar(this.formCasas.get('orden_anuncio').value).subscribe(datos => {
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
}
