import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { async, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { CasasService } from '../../services/casas.service';
import { CuartosService } from '../../services/cuartos.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-casaEditar',
  templateUrl: './casaEditar.component.html'
})
export class CasaEditarComponent implements OnInit {
  imgUrl = environment.imgUrl
  formInfoE: FormGroup;
  formImgE: FormGroup;
  formCuartos: FormGroup;

  urls = [];
  urlPrincipal = null;
  urlCarousel = null;

  urlsCuarto = [];
  urlPrincipalCuarto = null;

  cuarto: any = {};
  id_cuarto: number = null;
  casa: any = {};
  id_casa: number = null;

  imgPrincipalSeleccionadaCuarto: File = null;
  imgsSeleccionadasCuarto: File[] = [];
  listaImgCuarto: any[] = [];
  imgSeleccionada: File = null;
  imgCarouselSeleccionada: File = null;
  imgsSeleccionadas: File[] = [];
  listaImg: any[] = [];

  errorNombre: string = "";

  imgs: any = null;
  cuartos: any = null;
  mensajeError = null;
  errorOrden: string = null;
  noCuartos: boolean = null;

  chartLabels: string[] = [];
  chartData: number[] = [];

  comentarios: any = null;
  sinComentarios: boolean = false;
  comentariosNotificacion: any = null;
  sinComentariosNotificacion: boolean = false;

  infoCasa: any = {
    id: null,
    nombre: null,
    tipo: null,
    desc: null,
    orden: null,
    enlace: null
  };

  imgsCasa: any = {
    id: null,
    imgPrincipal: null,
    imgCarousel: null,
    imgs: null
  };
  Cuarto: any = {
    id_casa: null,
    nombre_cuarto: null,
    descripcion_cuarto: null,
    imgPrincipalCuarto: null,
    imgsCuarto: null
  };
  /*boletoCasa: any = {
    id: null,
    nombre: null,
    desc: null,
    inventario: null,
    precio: null
  }*/

  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['Anterior', 'Siguietne'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true
  }

  @ViewChild('imgInputP') imgInputP: ElementRef;
  @ViewChild('imgInputC') imgInputC: ElementRef;
  @ViewChild('imgsInput') imgsInput: ElementRef;
  @ViewChild('imgInputPriCua') imgInputPriCua: ElementRef;
  @ViewChild('imgsInputCua') imgsInputCua: ElementRef;
  @ViewChild('modalError') modalError;
  @ViewChild('cerrarModalError') cerrarModalError;
  @ViewChild('cerrar') cerrar;


  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private casasService: CasasService,
    private cuartosService: CuartosService,
    private router: Router) { }

  ngOnInit() {
    this.formInfoInit();
    this.formImgInit();
    this.formCuartoInit();
    this.activatedRoute.params.subscribe(params => {
      this.casasService.getCasa(params['id']).subscribe(resultado => {
        console.log(resultado)
        this.casa = resultado[0];

        this.formInfoE.setValue({
          nombre_casa: this.casa.nombre_casa,
          ambiente: this.casa.ambiente,
          descripcion_casa: this.casa.descripcion_casa,
          orden_anuncio: this.casa.orden_anuncio,
          direccion_casa: this.casa.direccion_casa,
        });

      });
      this.casasService.getImgs(params['id']).subscribe(resultado => this.imgs = resultado);
      this.cuartosService.getCuartos(params['id']).subscribe(resultado => {
        if (resultado == null) {
          this.noCuartos = true;
        } else {
          this.noCuartos = false;
          this.cuartos = resultado;
        }
      });

      this.id_casa = params['id'];
      this.getComentarios(params['id']);
      this.getComentariosNotificacion(params['id']);
      this.infoCasa.id = params['id'];
      this.imgsCasa.id = params['id'];
      this.Cuarto.id_casa = params['id'];
      //this.boletoCasa.id = params['id'];

    });
  }

  getComentarios(id_casa) {
    this.casasService.getComentarios(id_casa).subscribe(resultado => {
      this.comentarios = resultado;
      if (this.comentarios == null) {
        this.sinComentarios = true;
      }
      else {
        this.sinComentarios = false;
      }
    })
  }
  getComentariosNotificacion(id_casa) {
    this.casasService.getComentariosNotificacion(id_casa).subscribe(resultado => {
      this.comentariosNotificacion = resultado;
      if (this.comentariosNotificacion == null) {
        this.sinComentariosNotificacion = true;
      }
      else {
        this.sinComentariosNotificacion = false;
      }
    })
  }
  eliminarComentario(id_calificacion: number) {
    if (window.confirm("Está seguro de querer desactivar el comentario?")) {
      this.casasService.DesactivarComentario(id_calificacion).subscribe(() => {
        this.activatedRoute.params.subscribe(() => {
          this.activatedRoute.params.subscribe(params => {
            this.getComentarios(params['id']);
            this.getComentariosNotificacion(params['id']);
          });
        });
      });
    }
  }
  activarComentario(id_calificacion: number) {
    if (window.confirm("Está seguro de querer activar el comentario?")) {
      this.casasService.ActivarComentario(id_calificacion).subscribe(() => {
        this.activatedRoute.params.subscribe(() => {
          this.activatedRoute.params.subscribe(params => {
            this.getComentariosNotificacion(params['id']);
          });
        });
      });
    }
  }


  formInfoInit() {
    this.formInfoE = this.fb.group({
      nombre_casa: ['', [Validators.required]],
      ambiente: ['', [Validators.required]],
      descripcion_casa: ['', [Validators.required]],
      direccion_casa: ['', [Validators.required]],
      orden_anuncio: ['', Validators.required],
    })
  }

  formImgInit() {
    this.formImgE = this.fb.group({
      imgPrincipal: ['', RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })],
      imgCarousel: ['', RxwebValidators.image({ minWidth: 1250, maxWidth: 4096, minHeight: 690, maxHeight: 2160 })],
      imgsCasa: ['', RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })]
    })
  }

  formCuartoInit() {
    this.formCuartos = this.fb.group({
      nombre_cuarto: ['', [Validators.required]],
      descripcion_cuarto: ['', [Validators.required]],
      imgPrincipalCuarto: ['', [Validators.required, RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })]],
      imgsCuarto: ['', [Validators.required, RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })]]
    })
  }

  get validacionNombre() {
    return this.formInfoE.get('nombre_casa').invalid && this.formInfoE.get('nombre_casa').touched;
  }

  get nombreExistente() {
    return this.formInfoE.get('nombre_casa').invalid && this.formInfoE.get('nombre_casa').value != '' && !this.formInfoE.get('nombre_casa').pristine;
  }

  get validacionAmbiente() {
    return this.formInfoE.get('ambiente').invalid && this.formInfoE.get('ambiente').touched;
  }


  get validacionDesc() {
    return this.formInfoE.get('descripcion_casa').invalid && this.formInfoE.get('descripcion_casa').touched;
  }

  get validacionOrden() {
    return this.formInfoE.get('orden_anuncio').invalid && this.formInfoE.get('orden_anuncio').touched;
  }

  get validacionTamImg() {
    return this.formImgE.get('imgPrincipal').invalid && this.formImgE.get('imgPrincipal').dirty
  }

  get validacionTamImgs() {
    return this.formImgE.get('imgsCasa').invalid
  }

  get validacionTamImgCarousel() {
    return this.formImgE.get('imgCarousel').invalid && this.formImgE.get('imgCarousel').dirty
  }

  get validacionImgCuarto() {
    return this.formCuartos.get('imgPrincipalCuarto').invalid && this.formCuartos.get('imgPrincipalCuarto').touched && this.formCuartos.get('imgPrincipalCuarto').value == '';
  }

  get validacionTamImgPCuarto() {
    return this.formCuartos.get('imgPrincipalCuarto').invalid && this.formCuartos.get('imgPrincipalCuarto').dirty
  }

  get validacionImgsCuarto() {
    return this.formCuartos.get('imgsCuarto').invalid && this.formCuartos.get('imgsCuarto').touched && this.formCuartos.get('imgsCuarto').value == '';
  }

  get validacionTamImgsCuarto() {
    return this.formCuartos.get('imgsCuarto').invalid
  }

  editarBoleto(id: number) {
    this.router.navigate(['editar-boleto', id])
  }

  refresh() {
    this.activatedRoute.params.subscribe(params => {
      this.casasService.getCasa(params['id']).subscribe(resultado => this.casa = resultado[0]);
      this.casasService.getImgs(params['id']).subscribe(resultado => this.imgs = resultado);
      this.cuartosService.getCuartos(params['id']).subscribe(resultado => {
        if (resultado == null) {
          this.noCuartos = false;
        } else {
          this.noCuartos = true;
          this.cuartos = resultado;
        }
      });
    });
  }

  guardarInfo() {
    this.casasService.consultaNombre(this.formInfoE.get('nombre_casa').value, this.casa.id_casa).subscribe(datos => {
      if (datos['estado'] == 0) {
        this.errorNombre = datos['mensaje'];
        window.confirm(this.errorNombre);
      }
      else if (datos['estado'] == 1) {

        this.casasService.buscarLugar(this.formInfoE.get('orden_anuncio').value).subscribe(datos => {
          if (datos['estado'] == 0) {
            if (this.formInfoE.get('orden_anuncio').value == this.casa.orden_anuncio) {
              datos['estado'] = 1
            } else {
              this.errorOrden = datos['mensaje'];
              this.modalError.nativeElement.click();
            }
          }
          if (datos['estado'] == 1) {
            this.formInfoE.addControl('id_casa', this.fb.control(this.casa.id_casa))
            this.casasService.modificarInfoCasa(this.formInfoE.value).subscribe(datos => {
              if (datos['resultado'] == "ERROR") {
                console.log("ERROR");
                return
              } else if (datos['resultado'] == "OK") {
                this.refresh();
                window.confirm("Información modificada con éxito");
              }
            })
          }
        });
      }
    });
  }

  liberarLugar() {
    this.casasService.liberarLugar(this.formInfoE.get('orden').value, this.infoCasa.id).subscribe(datos => {
      if (datos['resultado'] == "ERROR") {
        console.log("ERROR");
        return
      }
      else if (datos['resultado'] == "OK") {
        window.confirm("Lugar liberado con exito");
        this.cerrarModalError.nativeElement.click();
      }
    })
  }

  eliminarImgCasa(id: number) {
    console.log(id)
    if (confirm("Está seguro de querer eliminar esta imagen?")) {
      this.casasService.eliminarImgCasa(id).subscribe(datos => {
		    if (datos['resultado'] == "OK") {
          this.refresh();
		      window.confirm("Imagen eliminada con éxito");
        }
      })
    }
  }

  imgPrincipal(event) {
    this.imgSeleccionada = <File>event.target.files[0];
    this.formImgE.controls['imgPrincipal'].setValue(this.imgSeleccionada);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        console.log(event.target.result);
        this.urlPrincipal = event.target.result;
      }
    }
  }

  imgCarousel(event) {
    this.imgCarouselSeleccionada = <File>event.target.files[0];
    this.formImgE.controls['imgCarousel'].setValue(this.imgCarouselSeleccionada);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        console.log(event.target.result);
        this.urlCarousel = event.target.result;
      }
    }
  }

  multiImg(event) {

    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {
          if (!this.validacionTamImgs) {
            this.urls.push(event.target.result);
          }
        }

        var selectedFile = event.target.files[i];

        if (!this.validacionTamImgs) {
          this.imgsSeleccionadas.push(selectedFile);
        }
      }
    }
    console.log(this.imgsSeleccionadas);
    // this.formImgE.controls['imgsCasa'].setValue(this.imgsSeleccionadas);
  }

  borrarImgPrincipal() {
    this.urlPrincipal = null;
    this.formCuartos.controls['imgPrincipalCuarto'].setValue("");
    this.imgInputPriCua.nativeElement.value = null;
  }

  borrarImgCarousel() {
    this.urlCarousel = null;
    this.formImgE.controls['imgCarousel'].setValue("");
    this.imgInputC.nativeElement.value = null;
  }

  borrarImgs(url: any, index: number) {
    this.urls = this.urls.filter((a) => a !== url);
    this.listaImg.splice(index, 1);
    this.imgsSeleccionadas.splice(index, 1);

    this.formImgE.controls['imgsCasa'].reset();

    console.log(this.formImgE.get('imgsCasa').value);
    if (this.imgsSeleccionadas.length == 0) {
      this.formImgE.controls['imgsCasa'].setValue("");
      this.imgsInput.nativeElement.value = null;
    }

    console.log(this.formImgE);
  }
  guardarImg() {
    this.imgsCasa.imgPrincipal = this.imgSeleccionada;
    this.imgsCasa.imgCarousel = this.imgCarouselSeleccionada;
    this.imgsCasa.imgs = this.imgsSeleccionadas;
    this.casasService.modificarImgsCasa(this.imgsCasa,this.casa.id_casa.toString()).subscribe(datos => {
      if (datos['resultado'] == "ERROR") {
        console.log("ERROR");
        return
      } else if (datos['resultado'] == "OK") {
        this.refresh();

        this.borrarImgPrincipal();
        this.borrarImgCarousel();

        this.urls = [];
        this.imgsSeleccionadas = [];
        this.imgsInput.nativeElement.value = null;
        window.confirm("Imagen(es) modificada(s) con éxito");
      }
    });
  }

  imgPrincipalCuarto(event) {
    this.imgPrincipalSeleccionadaCuarto = <File>event.target.files[0];
    this.formCuartos.controls['imgPrincipalCuarto'].setValue(this.imgPrincipalSeleccionadaCuarto);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        console.log(event.target.result);
        this.urlPrincipalCuarto = event.target.result;
      }
    }
  }

  multiImgCuarto(event) {

    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {
          if (!this.validacionTamImgsCuarto) {
            this.urlsCuarto.push(event.target.result);
          }
        }

        var selectedFile = event.target.files[i];

        if (!this.validacionTamImgsCuarto) {
          this.imgsSeleccionadasCuarto.push(selectedFile);
        }
      }
    }
    console.log(this.imgsSeleccionadasCuarto);
    // this.formImgE.controls['imgsCasa'].setValue(this.imgsSeleccionadas);
  }

  borrarImgPrincipalCuarto() {
    this.urlPrincipalCuarto = null;
    this.formCuartos.controls['imgPrincipalCuarto'].setValue("");
    this.imgInputPriCua.nativeElement.value = null;
  }

  borrarImgsCuarto(url: any, index: number) {
    this.urlsCuarto = this.urlsCuarto.filter((a) => a !== url);
    this.listaImgCuarto.splice(index, 1);
    this.imgsSeleccionadasCuarto.splice(index, 1);

    this.formCuartos.controls['imgsCuarto'].reset();

    console.log(this.formCuartos.get('imgsCuarto').value);
    if (this.imgsSeleccionadasCuarto.length == 0) {
      this.formCuartos.controls['imgsCuarto'].setValue("");
      this.imgsInputCua.nativeElement.value = null;
    }

    console.log(this.formCuartos);
  }

  guardarCuarto() {
    this.cuartosService.crearCuarto(this.formCuartos.value, this.casa.id_casa.toString()).subscribe(datos => {
      if (datos['resultado'] == 'OK') {
        this.activatedRoute.params.subscribe(params => {
          this.cuartosService.getCuartos(params['id']).subscribe(resultado => {
              this.cuartos = resultado;
          });
        });
        this.formCuartos.reset();

        this.borrarImgPrincipalCuarto();

        this.urlsCuarto = [];
        this.urlPrincipalCuarto = [];
        this.imgsInputCua.nativeElement.value = null;
        this.cerrar.nativeElement.click();
      }
    });


  }

  desactivarCuarto(id_cuarto: number) {
    if (window.confirm("Está seguro de querer desactivar este cuarto")) {
      this.cuartosService.desactivarCuarto(id_cuarto).subscribe(datos => {
          this.refresh();
          window.confirm("Boleto eliminado con éxito");
      })
    }
  }

  activarCuarto(id_cuarto: number) {
    if (window.confirm("Está seguro de querer activar este cuarto?")) {
      this.cuartosService.activarCuarto(id_cuarto).subscribe(datos => {
          this.refresh();
          window.confirm("Boleto eliminado con éxito");
      })
    }
  }

}
