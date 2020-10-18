import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { async, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { CasasService } from '../../services/casas.service';
import { BoletosService } from '../../services/boletos.service';
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
  formFechas: FormGroup;
  formImgE: FormGroup;
  formBoletos: FormGroup;

  urls = [];
  urlPrincipal = null;
  urlCarousel = null;

  casa: any = {};
  id_casa: number = null;

  imgSeleccionada: File = null;
  imgCarouselSeleccionada: File = null;
  imgsSeleccionadas: File[] = [];
  listaImg: any[] = [];

  errorNombre: string = "";

  imgs: any = null;
  boletos: any = null;
  mensajeError = null;
  errorOrden: string = null;
  noBoletos: boolean = null;

  edadData: any = null;

  chartLabels: string[] = [];
  chartData: number[] = [];

  ventasTotales: any = null;
  ventasDia: any = null;
  ventasRango: any = null;
  hayVentasDia: boolean = null;
  hayVentasRango: boolean = null;

  comentarios: any = null;
  sinComentarios: boolean = false;

  infoCasa: any = {
    id: null,
    nombre: null,
    tipo: null,
    desc: null,
    orden: null,
    enlace: null
  };

  fechasCasa: any = {
    id: null,
    diaInicio: null,
    diaFin: null,
    horaInicio: null,
    horaFin: null
  };

  imgsCasa: any = {
    id: null,
    imgPrincipal: null,
    imgCarousel: null,
    imgs: null
  };

  boletoCasa: any = {
    id: null,
    nombre: null,
    desc: null,
    inventario: null,
    precio: null
  }

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
  @ViewChild('modalError') modalError;
  @ViewChild('cerrarModalError') cerrarModalError;


  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private casasService: CasasService,
    private boletosService: BoletosService,
    private router: Router) { }

  ngOnInit() {
    this.formInfoInit();
    this.formFechasInit();
    this.formImgInit();
    this.formBoletosInit();
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

        this.formFechas.setValue({
          diaInicio: this.casa.dia_inicio_casa,
          diaFin: this.casa.dia_conclusion_casa,
          horaInicio: this.casa.hora_inicio_casa,
          horaFin: this.casa.hora_conclusion_casa
        });

      });
      this.casasService.getImgs(params['id']).subscribe(resultado => this.imgs = resultado);
      this.boletosService.getBoletos(params['id']).subscribe(resultado => {
        if (resultado == null) {
          this.noBoletos = true;
        } else {
          this.noBoletos = false;
          this.boletos = resultado;
        }
      });

      this.id_casa = params['id'];
      this.getComentarios(params['id']);
      this.getVentasTotales(params['id']);
      this.infoCasa.id = params['id'];
      this.fechasCasa.id = params['id'];
      this.imgsCasa.id = params['id'];
      this.boletoCasa.id = params['id'];

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

  eliminarComentario(id_calificacion: number) {
    if (window.confirm("Está seguro de querer eliminar el comentario?")) {
      this.casasService.eliminarComentrio(id_calificacion).subscribe(() => {
        this.activatedRoute.params.subscribe(() => {
          this.activatedRoute.params.subscribe(params => {
            this.getComentarios(params['id']);
          });
        });
      });
    }
  }

  

  getVentasTotales(id_casa: number) {
    this.casasService.getVentasTotales(id_casa).subscribe(resultado => {
      this.ventasTotales = resultado;
      console.log(this.ventasTotales);
    })
  }

  buscarVentasDia(fecha: any) {
    this.casasService.getVentasDia(fecha, this.id_casa).subscribe(resultado => {
      if (resultado == null) {
        this.hayVentasDia = false;
        return
      }
      else {
        this.hayVentasDia = true;
        this.ventasDia = resultado;
        console.log(this.ventasDia);
      }
    })
  }

  getVentasRango(fecha_1: any, fecha_2: any) {
    this.casasService.getVentasR(fecha_1, fecha_2, this.id_casa).subscribe(resultado => {
      if (resultado == null) {
        this.hayVentasRango = false;
        return
      }
      else {
        this.hayVentasRango = true;
        this.ventasRango = resultado;
        console.log(this.ventasRango);
      }
    })
  }

  formInfoInit() {
    this.formInfoE = this.fb.group({
      nombre_casa: ['', [Validators.required]],
      ambiente: ['', [Validators.required]],
      descripcion_casa: ['', [Validators.required]],
      orden_anuncio: ['', Validators.required],
    })
  }

  formFechasInit() {
    this.formFechas = this.fb.group({
      diaInicio: ['',],
      diaFin: ['',],
      horaInicio: ['',],
      horaFin: ['',],
    })
  }

  formImgInit() {
    this.formImgE = this.fb.group({
      imgPrincipal: ['', RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })],
      imgCarousel: ['', RxwebValidators.image({ minWidth: 1250, maxWidth: 4096, minHeight: 690, maxHeight: 2160 })],
      imgsCasa: ['', RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })]
    })
  }

  formBoletosInit() {
    this.formBoletos = this.fb.group({
      nombre: ['', Validators.required],
      desc: ['', Validators.required],
      inventario: ['', Validators.required],
      precio: ['', Validators.required]
    })
  }

  compararFechas() {
    let inicio = new Date(this.formFechas.get('diaInicio').value);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset())

    let cierre = new Date(this.formFechas.get('diaFin').value);
    cierre.setMinutes(cierre.getMinutes() + cierre.getTimezoneOffset())

    let hoy = new Date();
    hoy.setSeconds(0);
    hoy.setMinutes(0);
    hoy.setHours(0);

    if (inicio > cierre) {
      this.mensajeError = "El casa no puede terminar antes de empezar."
      this.formFechas.setErrors({ 'incorrect': true });
      return true
    }
    else if (hoy > inicio) {
      this.mensajeError = "El casa no puede empezar hoy o antes de hoy."
      this.formFechas.setErrors({ 'incorrect': true });
      return true
    }
    else if (hoy > cierre) {
      this.mensajeError = "El casa no puede terminar hoy o antes de hoy."
      this.formFechas.setErrors({ 'incorrect': true });
      return true
    }
    else {
      return false
    }
  }

  compararHorarios() {
    let inicio = new Date(this.formFechas.get('diaInicio').value);
    let cierre = new Date(this.formFechas.get('diaFin').value);


    if (inicio.getTime() === cierre.getTime()) {

      let horarioInicio = this.formFechas.get('horaInicio');
      let horarioCierre = this.formFechas.get('horaFin');

      if (horarioInicio.value >= horarioCierre.value) {
        this.formFechas.setErrors({ 'incorrect': true })
        return true
      }
      else {
        return false

      }
    }
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

  editarBoleto(id: number) {
    this.router.navigate(['editar-boleto', id])
  }

  refresh() {
    this.activatedRoute.params.subscribe(params => {
      this.casasService.getCasa(params['id']).subscribe(resultado => this.casa = resultado[0]);
      this.casasService.getImgs(params['id']).subscribe(resultado => this.imgs = resultado);
      this.boletosService.getBoletos(params['id']).subscribe(resultado => {
        if (resultado == null) {
          this.noBoletos = true;
        } else {
          this.noBoletos = false;
          this.boletos = resultado;
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

  guardarFechas() {
    this.fechasCasa.diaInicio = this.formFechas.get('diaInicio').value;
    this.fechasCasa.diaFin = this.formFechas.get('diaFin').value;
    this.fechasCasa.horaInicio = this.formFechas.get('horaInicio').value;
    this.fechasCasa.horaFin = this.formFechas.get('horaFin').value;
    console.log(this.fechasCasa.horarioInicio);
    console.log(this.fechasCasa.horarioFin);

    console.log(this.fechasCasa);

    this.casasService.modificarHorarioCasa(this.fechasCasa).subscribe(datos => {
      if (datos['resultado'] == "ERROR") {
        console.log("ERROR");
        return
      } else if (datos['resultado'] == "OK") {
        this.refresh();
        window.confirm("Horario modificado con éxito");
      }
    })
  }

  guardarImg() {
    this.imgsCasa.imgPrincipal = this.imgSeleccionada;
    this.imgsCasa.imgCarousel = this.imgCarouselSeleccionada;
    this.imgsCasa.imgs = this.imgsSeleccionadas;

    this.casasService.modificarImgsCasa(this.imgsCasa).subscribe(datos => {
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

  guardarBoletos() {
    this.boletoCasa.nombre = this.formBoletos.get('nombre').value;
    this.boletoCasa.desc = this.formBoletos.get('desc').value;
    this.boletoCasa.inventario = this.formBoletos.get('inventario').value;
    this.boletoCasa.precio = this.formBoletos.get('precio').value;

    this.boletosService.buscarNombre(this.boletoCasa.nombre, this.boletoCasa.id).subscribe(datos => {
      if (datos['estado'] == 0) {
        this.errorNombre = datos['mensaje'];
        window.confirm(this.errorNombre);
        return
      }
      else if (datos['estado'] == 1) {
        this.boletosService.crearBoleto(this.boletoCasa).subscribe(datos => {
          if (datos['resultado'] == "ERROR") {
            console.log("ERROR");
            return
          }
          else if (datos['resultado'] == "OK") {
            this.refresh();
            window.confirm("Boleto creado con éxito");
            this.formBoletos.reset();
          }
        })
      }
    });


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
    this.formImgE.controls['imgPrincipal'].setValue("");
    this.imgInputP.nativeElement.value = null;
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

  eliminarImg(id: number) {
    if (confirm("Está seguro de querer eliminar esta imagen?")) {
      this.casasService.eliminarImgs(id).subscribe(datos => {
        if (datos['resultado'] == "OK") {
          this.refresh();
          window.confirm("Imagen eliminada con éxito");
        }
      })
    }
  }

  eliminarBoleto(id_boleto: number) {
    if (window.confirm("Está seguro de querer eliminar este boleto?")) {
      this.boletosService.eliminarBoleto(id_boleto).subscribe(datos => {
        if (datos['resultado'] == "OK") {
          this.refresh();
          window.confirm("Boleto eliminado con éxito");
        }
      })
    }
  }
}
