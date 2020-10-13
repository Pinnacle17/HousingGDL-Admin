import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { BoletosService } from '../../services/boletos.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-eventoEditar',
  templateUrl: './eventoEditar.component.html'
})
export class EventoEditarComponent implements OnInit {

  formInfoE:FormGroup;
  formFechas:FormGroup;
  formImgE:FormGroup;
  formBoletos:FormGroup;

  urls = [];
  urlPrincipal = null;
  urlCarousel = null;

  evento:any = {};
  id_evento:number = null;

  imgSeleccionada:File = null;
  imgCarouselSeleccionada:File = null;
  imgsSeleccionadas:File[] = [];
  listaImg:any[] = [];

  errorNombre:string = "";

  imgs:any = null;
  boletos:any = null;
  mensajeError = null;
  errorOrden:string = null;
  noBoletos:boolean = null;

  edadData:any = null;

  chartLabels:string[] = [];
  chartData:number[] = [];

  ventasTotales:any = null;
  ventasDia:any = null;
  ventasRango:any = null;
  hayVentasDia:boolean = null;
  hayVentasRango:boolean = null;

  comentarios:any = null;
  sinComentarios:boolean = false;

  infoEvento:any = {
    id:null,
    nombre:null,
    tipo:null,
    desc:null,
    orden:null,
    enlace:null
  };

  fechasEvento:any = {
    id:null,
    diaInicio: null,
    diaFin: null,
    horaInicio: null,
    horaFin: null
  };

  imgsEvento:any = {
    id:null,
    imgPrincipal:null,
    imgCarousel:null,
    imgs:null
  };

  boletoEvento:any = {
    id:null,
    nombre:null,
    desc:null,
    inventario:null,
    precio:null
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

  @ViewChild('imgInputP') imgInputP:ElementRef;
  @ViewChild('imgInputC') imgInputC:ElementRef;
  @ViewChild('imgsInput') imgsInput:ElementRef;
  @ViewChild('modalError') modalError;
  @ViewChild('cerrarModalError') cerrarModalError;

  public barChartOptions: ChartOptions = {
    responsive: true
  };
  public barChartType:ChartType = 'bar';
  public barChartLegend = true;
  public barChartLabels:Label = [];
  public barChartData:ChartDataSets[] = [];

  public barChartColors:Color[] = [{
    backgroundColor: 'rgba(63,127,191,1)',
    borderColor: 'green',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];

  constructor(private fb:FormBuilder,
              private activatedRoute:ActivatedRoute,
              private eventosService:EventosService,
              private boletosService:BoletosService,
              private router:Router) {}

  ngOnInit() {
    this.formInfoInit();
    this.formFechasInit();
    this.formImgInit();
    this.formBoletosInit();
    this.activatedRoute.params.subscribe( params => {
      this.eventosService.getEvento(params['id']).subscribe( resultado => {
        this.evento = resultado[0];

        this.formInfoE.setValue({
          nombre: this.evento.nombre_evento,
          tipo: this.evento.tipo_evento,
          desc: this.evento.descripcion_evento,
          orden: this.evento.orden_anuncio,
          enlace: this.evento.enlace_evento
        });

        this.formFechas.setValue({
          diaInicio: this.evento.dia_inicio_evento,
          diaFin: this.evento.dia_conclusion_evento,
          horaInicio: this.evento.hora_inicio_evento,
          horaFin: this.evento.hora_conclusion_evento
        });

      });
      this.eventosService.getImgs(params['id']).subscribe(resultado => this.imgs = resultado);
      this.boletosService.getBoletos(params['id']).subscribe( resultado => {
        if(resultado == null){
          this.noBoletos = true;
        }else{
          this.noBoletos = false;
          this.boletos = resultado;
        }
      });

      this.id_evento = params['id'];
      this.getComentarios(params['id']);
      this.getVentasEdad(params['id']);
      this.getVentasTotales(params['id']);
      this.infoEvento.id = params['id'];
      this.fechasEvento.id = params['id'];
      this.imgsEvento.id = params['id'];
      this.boletoEvento.id = params['id'];

    });
  }

  getComentarios( id_evento ){
    this.eventosService.getComentarios(id_evento).subscribe(resultado => {
      this.comentarios = resultado;
      if(this.comentarios == null){
        this.sinComentarios = true;
      }
      else{
        this.sinComentarios = false;
      }
    })
  }

  eliminarComentario( id_calificacion:number ){
    if(window.confirm("Está seguro de querer eliminar el comentario?")){
      this.eventosService.eliminarComentrio(id_calificacion).subscribe( () => {
        this.activatedRoute.params.subscribe( () => {
          this.activatedRoute.params.subscribe( params => {
            this.getComentarios(params['id']);
          });
        });
      });
    }
  }

  getVentasEdad( id_evento:number ){
    this.eventosService.getVentasEdad(id_evento).subscribe(resultado => {
        this.edadData = resultado;
        console.log(this.edadData);

        for(let x in this.edadData){
          if(x != '0'){
            this.chartLabels.push(x.toString());
            this.chartData.push(this.edadData[x]['cantidad']);
          }
        }
        this.barChartLabels = this.chartLabels;
        this.barChartData = [
          {data: this.chartData, label: "Compras por edad" }
        ];
      })
  }

  getVentasTotales( id_evento:number ){
    this.eventosService.getVentasTotales(id_evento).subscribe( resultado => {
      this.ventasTotales = resultado;
      console.log(this.ventasTotales);
    })
  }

  buscarVentasDia( fecha:any ){
    this.eventosService.getVentasDia( fecha, this.id_evento).subscribe( resultado => {
      if(resultado == null){
        this.hayVentasDia = false;
        return
      }
      else{
        this.hayVentasDia = true;
        this.ventasDia = resultado;
        console.log(this.ventasDia);
      }
    })
  }

  getVentasRango( fecha_1:any, fecha_2:any ){
    this.eventosService.getVentasR( fecha_1, fecha_2, this.id_evento).subscribe( resultado => {
      if(resultado == null){
        this.hayVentasRango = false;
        return
      }
      else{
        this.hayVentasRango = true;
        this.ventasRango = resultado;
        console.log(this.ventasRango);
      }
    })
  }

  formInfoInit(){
    this.formInfoE = this.fb.group({
      nombre:['',],
      tipo:['',],
      desc:['',],
      orden:['',],
      enlace:['',]
    })
  }

  formFechasInit(){
    this.formFechas = this.fb.group({
      diaInicio:['',],
      diaFin:['',],
      horaInicio:['',],
      horaFin:['',],
    })
  }

  formImgInit(){
    this.formImgE = this.fb.group({
      imgPrincipal:['', RxwebValidators.image({minHeight:690, maxHeight:2160, minWidth:950, maxWidth:4096})],
      imgCarousel:['', RxwebValidators.image({minWidth:1250, maxWidth:4096, minHeight:690, maxHeight:2160})],
      imgsEvento: ['', RxwebValidators.image({minHeight:690, maxHeight:2160, minWidth:950, maxWidth:4096})]
    })
  }

  formBoletosInit(){
    this.formBoletos = this.fb.group({
      nombre:['', Validators.required],
      desc:['', Validators.required],
      inventario:['', Validators.required],
      precio:['', Validators.required]
    })
  }

  compararFechas(){
    let inicio = new Date(this.formFechas.get('diaInicio').value);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset())

    let cierre = new Date(this.formFechas.get('diaFin').value);
    cierre.setMinutes(cierre.getMinutes() + cierre.getTimezoneOffset())

    let hoy = new Date();
    hoy.setSeconds(0);
    hoy.setMinutes(0);
    hoy.setHours(0);

    if(inicio > cierre){
      this.mensajeError = "El evento no puede terminar antes de empezar."
      this.formFechas.setErrors({'incorrect':true});
      return true
    }
    else if( hoy > inicio ){
      this.mensajeError = "El evento no puede empezar hoy o antes de hoy."
      this.formFechas.setErrors({'incorrect':true});
      return true
    }
    else if( hoy > cierre ){
      this.mensajeError = "El evento no puede terminar hoy o antes de hoy."
      this.formFechas.setErrors({'incorrect':true});
      return true
    }
    else{
      return false
    }
  }

  compararHorarios(){
    let inicio = new Date(this.formFechas.get('diaInicio').value);
    let cierre = new Date(this.formFechas.get('diaFin').value);


    if(inicio.getTime() === cierre.getTime()){

      let horarioInicio = this.formFechas.get('horaInicio');
      let horarioCierre = this.formFechas.get('horaFin');

      if(horarioInicio.value >= horarioCierre.value) {
        this.formFechas.setErrors({'incorrect': true})
        return true
      }
      else{
        return false

      }
    }
  }

  get validacionTamImg(){
    return this.formImgE.get('imgPrincipal').invalid && this.formImgE.get('imgPrincipal').dirty
  }

  get validacionTamImgs(){
    return this.formImgE.get('imgsEvento').invalid
  }

  get validacionTamImgCarousel(){
    return this.formImgE.get('imgCarousel').invalid && this.formImgE.get('imgCarousel').dirty
  }

  editarBoleto( id:number){
    this.router.navigate(['editar-boleto', id])
  }

  refresh(){
    this.activatedRoute.params.subscribe( params => {
      this.eventosService.getEvento(params['id']).subscribe( resultado => this.evento = resultado[0]);
      this.eventosService.getImgs(params['id']).subscribe( resultado => this.imgs = resultado);
      this.boletosService.getBoletos(params['id']).subscribe( resultado => {
        if(resultado == null){
          this.noBoletos = true;
        }else{
          this.noBoletos = false;
          this.boletos = resultado;
        }
      });
    });
  }

  guardarInfo(){
    this.infoEvento.nombre = this.formInfoE.get('nombre').value;
    this.infoEvento.tipo = this.formInfoE.get('tipo').value;
    this.infoEvento.desc = this.formInfoE.get('desc').value;
    this.infoEvento.orden = this.formInfoE.get('orden').value;
    this.infoEvento.enlace = this.formInfoE.get('enlace').value;

    this.eventosService.buscarNombre(this.infoEvento.nombre, this.infoEvento.id).subscribe( datos => {
      if(datos['estado'] == 0){
        this.errorNombre = datos['mensaje'];
        window.confirm(this.errorNombre);
      }
      else if(datos['estado'] == 1){
        this.eventosService.buscarLugar(this.infoEvento.orden, this.infoEvento.id).subscribe(datos => {
          if(datos['estado'] == 0){
            this.errorOrden = datos['mensaje'];
            this.modalError.nativeElement.click();
          }
          else if(datos['estado'] == 1){
            this.eventosService.modificarInfoEvento(this.infoEvento).subscribe( datos => {
              if(datos['resultado'] == "ERROR"){
                console.log("ERROR");
                return
              }else if(datos['resultado'] == "OK"){
                this.refresh();
                window.confirm("Información modificada con éxito");
              }
            })
          }
        });
      }
    });
  }

  liberarLugar(){
    this.eventosService.liberarLugar(this.formInfoE.get('orden').value, this.infoEvento.id).subscribe( datos => {
      if(datos['resultado'] == "ERROR"){
        console.log("ERROR");
        return
      }
      else if(datos['resultado'] == "OK"){
        window.confirm("Lugar liberado con exito");
        this.cerrarModalError.nativeElement.click();
      }
    })
  }

  guardarFechas(){
    this.fechasEvento.diaInicio = this.formFechas.get('diaInicio').value;
    this.fechasEvento.diaFin = this.formFechas.get('diaFin').value;
    this.fechasEvento.horaInicio = this.formFechas.get('horaInicio').value;
    this.fechasEvento.horaFin = this.formFechas.get('horaFin').value;
    console.log(this.fechasEvento.horarioInicio);
    console.log(this.fechasEvento.horarioFin);

    console.log(this.fechasEvento);

    this.eventosService.modificarHorarioEvento(this.fechasEvento).subscribe( datos => {
      if(datos['resultado'] == "ERROR"){
        console.log("ERROR");
        return
      }else if(datos['resultado'] == "OK"){
        this.refresh();
        window.confirm("Horario modificado con éxito");
      }
    })
  }

  guardarImg(){
    this.imgsEvento.imgPrincipal = this.imgSeleccionada;
    this.imgsEvento.imgCarousel = this.imgCarouselSeleccionada;
    this.imgsEvento.imgs = this.imgsSeleccionadas;

    this.eventosService.modificarImgsEvento(this.imgsEvento).subscribe( datos => {
      if(datos['resultado'] == "ERROR"){
        console.log("ERROR");
        return
      }else if(datos['resultado'] == "OK"){
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

  guardarBoletos(){
    this.boletoEvento.nombre = this.formBoletos.get('nombre').value;
    this.boletoEvento.desc = this.formBoletos.get('desc').value;
    this.boletoEvento.inventario = this.formBoletos.get('inventario').value;
    this.boletoEvento.precio = this.formBoletos.get('precio').value;

    this.boletosService.buscarNombre(this.boletoEvento.nombre, this.boletoEvento.id).subscribe(datos => {
      if(datos['estado'] == 0){
        this.errorNombre = datos['mensaje'];
        window.confirm(this.errorNombre);
        return
      }
      else if(datos['estado'] == 1){
        this.boletosService.crearBoleto(this.boletoEvento).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            console.log("ERROR");
            return
          }
          else if(datos['resultado'] == "OK"){
            this.refresh();
            window.confirm("Boleto creado con éxito");
            this.formBoletos.reset();
          }
        })
      }
    });


  }

  imgPrincipal(event){
    this.imgSeleccionada = <File>event.target.files[0];
    this.formImgE.controls['imgPrincipal'].setValue(this.imgSeleccionada);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
        console.log(event.target.result);
          this.urlPrincipal = event.target.result;
      }
    }
  }

  imgCarousel(event){
    this.imgCarouselSeleccionada = <File>event.target.files[0];
    this.formImgE.controls['imgCarousel'].setValue(this.imgCarouselSeleccionada);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
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
        reader.onload = (event:any) => {
          if(!this.validacionTamImgs){
            this.urls.push(event.target.result);
          }
        }

        var selectedFile = event.target.files[i];

        if(!this.validacionTamImgs){
          this.imgsSeleccionadas.push(selectedFile);
        }
      }
    }
    console.log(this.imgsSeleccionadas);
    // this.formImgE.controls['imgsEvento'].setValue(this.imgsSeleccionadas);
  }

  borrarImgPrincipal(){
    this.urlPrincipal = null;
    this.formImgE.controls['imgPrincipal'].setValue("");
    this.imgInputP.nativeElement.value = null;
  }

  borrarImgCarousel(){
    this.urlCarousel = null;
    this.formImgE.controls['imgCarousel'].setValue("");
    this.imgInputC.nativeElement.value = null;
  }

  borrarImgs( url:any, index:number ){
    this.urls = this.urls.filter((a) => a !== url);
    this.listaImg.splice(index, 1);
    this.imgsSeleccionadas.splice(index, 1);

    this.formImgE.controls['imgsEvento'].reset();

    console.log(this.formImgE.get('imgsEvento').value);
    if(this.imgsSeleccionadas.length == 0){
      this.formImgE.controls['imgsEvento'].setValue("");
      this.imgsInput.nativeElement.value = null;
    }

    console.log(this.formImgE);
  }

  eliminarImg( id:number ){
    if(confirm("Está seguro de querer eliminar esta imagen?")){
      this.eventosService.eliminarImgs(id).subscribe( datos => {
        if(datos['resultado'] == "OK"){
          this.refresh();
          window.confirm("Imagen eliminada con éxito");
        }
      })
    }
  }

  eliminarBoleto( id_boleto:number){
    if(window.confirm("Está seguro de querer eliminar este boleto?")){
      this.boletosService.eliminarBoleto(id_boleto).subscribe( datos => {
        if(datos['resultado'] == "OK"){
          this.refresh();
          window.confirm("Boleto eliminado con éxito");
        }
      })
    }
  }
}
