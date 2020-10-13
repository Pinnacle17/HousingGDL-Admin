import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoletosService } from '../../services/boletos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-boleto-editar',
  templateUrl: './boleto-editar.component.html'
})
export class BoletoEditarComponent implements OnInit {

  @ViewChild('cerrarCodigo') cerrarCodigo;
  @ViewChild('cerrarFechas') cerrarFechas;
  @ViewChild('cerrarReferencia') cerrarReferencia;

  boleto:any = {};

  formPromoFechas:FormGroup;
  formPromoReferencia:FormGroup;
  formPromoCodigo:FormGroup;

  mensajeError:string = null;

  eventos:any = null;
  boletos:any = null;
  promosCodigo:any = null;
  promosFechas:any = null;
  promosReferencia:any = null;

  errorCodigo:string = "";
  id_evento:number = null;

  infoBoleto:any = {
    id:null,
    nombre:null,
    desc:null,
    inventario:null,
    precio:null
  }

  infoPromoFechas:any = {
    id_boleto:null,
    id_evento:null,
    fechaInicio:null,
    fechaFin:null,
    inventario:null,
    precio:null
  }

  infoPromoCodigo:any = {
    id: null,
    codigo:null,
    inventario:null,
    precio:null
  }

  formInfoBoleto:FormGroup;
  constructor(private activatedRoute:ActivatedRoute,
              private boletosService:BoletosService,
              private fb:FormBuilder,
              private eventosService:EventosService) { }

  ngOnInit() {
    this.getEventos();
    this.formInfoBoletoInit();
    this.formPromoFechasInit();
    this.formPromoCodigoInit();
    this.formPromoReferenciaInit();
    console.log(this.formPromoReferencia.value);
    this.activatedRoute.params.subscribe( params => {
      this.boletosService.getBoleto(params['id']).subscribe( resultado => {

        this.boleto = resultado[0];

        this.infoPromoFechas.id_evento = this.boleto.fk_evento_bol

        this.formInfoBoleto.setValue({
          nombre:this.boleto.nom_bol,
          desc:this.boleto.descripcion_boleto,
          inventario:this.boleto.stock_act_boleto,
          precio:this.boleto.precio_bol
        });
      });

      this.boletosService.getPromosCodigo(params['id']).subscribe(resultado => this.promosCodigo = resultado);
      this.boletosService.getPromosFechas(params['id']).subscribe(resultado => this.promosFechas = resultado);
      this.boletosService.getPromosReferencia(params['id']).subscribe(resultado => this.promosReferencia = resultado);

      this.formPromoReferencia.addControl('boleto', this.fb.control(null));
      this.formPromoReferencia.get('boleto').setValue(params['id']);
      this.infoPromoCodigo.id = params['id'];
      this.infoBoleto.id = params['id'];
      this.infoPromoFechas.id_boleto = params['id'];

    });

  }

  formInfoBoletoInit(){
    this.formInfoBoleto = this.fb.group({
      nombre:['',],
      desc:['',],
      inventario:['',],
      precio:['',]
    })
  }

  formPromoCodigoInit(){
    this.formPromoCodigo = this.fb.group({
      codigo:['', [Validators.maxLength(10), Validators.minLength(10)]],
      inventarioCodigo:['',],
      precioCodigo:['',]
    })
  }

  formPromoFechasInit(){
    this.formPromoFechas = this.fb.group({
      fechaInicio:['',],
      fechaFin:['',],
      inventarioFechas:['',],
      precioFechas:['',]
    })
  }

  formPromoReferenciaInit(){
    this.formPromoReferencia = this.fb.group({
      boletoReferencia:[null],
      inventarioReferencia:[''],
      precioReferencia:['']
    });
  }

  get codigoValidacion(){
    return this.formPromoCodigo.get('codigo').invalid
  }
  compararFechas(){
    let inicio = new Date(this.formPromoFechas.get('fechaInicio').value);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset())

    let cierre = new Date(this.formPromoFechas.get('fechaFin').value);
    cierre.setMinutes(cierre.getMinutes() + cierre.getTimezoneOffset())

    let hoy = new Date();
    hoy.setSeconds(0);
    hoy.setMinutes(0);
    hoy.setHours(0);

    if(inicio > cierre){
      this.mensajeError = "El evento no puede terminar antes de empezar."
      this.formPromoFechas.setErrors({'incorrect':true});
      return true
    }
    else if( hoy > inicio ){
      this.mensajeError = "El evento no puede empezar hoy o antes de hoy."
      this.formPromoFechas.setErrors({'incorrect':true});
      return true
    }
    else if( hoy > cierre ){
      this.mensajeError = "El evento no puede terminar hoy o antes de hoy."
      this.formPromoFechas.setErrors({'incorrect':true});
      return true
    }
    else{
      return false
    }
  }

  refresh(){
    this.activatedRoute.params.subscribe( params => {
      this.boletosService.getBoleto(params['id']).subscribe( resultado => this.boleto = resultado[0]);
      this.boletosService.getPromosCodigo(params['id']).subscribe(resultado => this.promosCodigo = resultado);
      this.boletosService.getPromosFechas(params['id']).subscribe(resultado => this.promosFechas = resultado);
      this.boletosService.getPromosReferencia(params['id']).subscribe(resultado => this.promosReferencia = resultado);
    });
  }

  getEventos(){
    this.eventosService.getEventos().subscribe( resultado => {
      this.eventos = resultado
      console.log(this.eventos );
    });
  }

  getBoletos( event:any ){
    this.id_evento = event.target.value
    if(this.id_evento != null){
      this.boletosService.getBoletos(this.id_evento).subscribe( resultado => this.boletos = resultado)
    }
    else{
      return
    }
  }

  guardarInfo(){
    this.infoBoleto.nombre = this.formInfoBoleto.get('nombre').value;
    this.infoBoleto.desc = this.formInfoBoleto.get('desc').value;
    this.infoBoleto.inventario = this.formInfoBoleto.get('inventario').value;
    this.infoBoleto.precio = this.formInfoBoleto.get('precio').value;


    this.boletosService.buscarNombre(this.infoBoleto.nombre, this.infoBoleto.id).subscribe(datos => {
      if(datos['estado'] == 0){
        window.confirm(datos['mensaje']);
        return
      }
      else if(datos['estado'] == 1){
        this.boletosService.modificarBoleto(this.infoBoleto).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            console.log("ERROR");
            return
          }
          else if(datos['resultado'] == "OK"){
            this.refresh();
            window.confirm("Boleto modificado con éxito");
          }
        })
      }
    });

  }

  crearPromoFecha(){
    this.infoPromoFechas.fechaInicio = this.formPromoFechas.get('fechaInicio').value
    this.infoPromoFechas.fechaFin = this.formPromoFechas.get('fechaFin').value
    this.infoPromoFechas.inventario = this.formPromoFechas.get('inventarioFechas').value
    this.infoPromoFechas.precio = this.formPromoFechas.get('precioFechas').value

    this.boletosService.crearPromoFecha(this.infoPromoFechas).subscribe( datos => {
      if(datos['estado'] == -1){
        window.confirm(datos['mensaje']);
        return
      }
      else if(datos['estado'] == 0){
        window.confirm(datos['mensaje']);
        return
      }
      else{
        if(datos['resultado'] == "ERROR"){
          window.confirm("Ha habido un error.");
          return
        }
        else if(datos['resultado'] == "OK"){
          this.refresh();
          this.formPromoFechas.reset();
          window.confirm("Promoción creada con éxito.");
          this.cerrarFechas.nativeElement.click();
        }
      }
    })
  }

  crearPromoCodigo(){
    this.infoPromoCodigo.codigo = this.formPromoCodigo.get('codigo').value;
    this.infoPromoCodigo.inventario = this.formPromoCodigo.get('inventarioCodigo').value;
    this.infoPromoCodigo.precio = this.formPromoCodigo.get('precioCodigo').value;

    this.boletosService.buscarCodigo(this.infoPromoCodigo.codigo).subscribe(datos => {
      if(datos['estado'] == 0){
        this.errorCodigo = datos['mensaje'];
        window.confirm(this.errorCodigo);
      }
      else if(datos['estado'] == 1){
        this.boletosService.crearPromoCodigo(this.infoPromoCodigo).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            console.log("ERROR");
            return
          }
          else if(datos['resultado'] == "OK"){
            this.refresh();
            this.formPromoCodigo.reset()
            window.confirm("Promocion creada con éxito");
            this.cerrarCodigo.nativeElement.click();
          }
        });
      }
    });
  }

  crearPromoReferecnia(){
    if(this.formPromoReferencia.get('boleto').value == this.formPromoReferencia.get('boletoReferencia').value ){
      window.confirm("No puede elegir el mismo boleto dos veces.");
      return
    }
    else{
      this.boletosService.crearPromoReferencia(this.formPromoReferencia.value).subscribe( datos => {
        if(datos['resultado'] == "ERROR"){
          console.log("ERROR");
          return
        }
        else if(datos['resultado'] == "OK"){
          this.refresh();
          this.formPromoReferencia.reset();
          window.confirm("Promocion creada con éxito");
          this.cerrarReferencia.nativeElement.click();
        }
      })
    }
  }

  eliminarPromoFechas( id_promo:number ){
    if(window.confirm("Seguro de querer eliminar ésta promoción?")){
      this.boletosService.eliminarPromoFechas(id_promo).subscribe( datos => {
        if(datos['resultado'] == "ERROR"){
          console.log("ERROR");
          return
        }
        else if(datos['resultado'] == "OK"){
          this.refresh();
        }
      })
    }
  }

  eliminarPromoCodigo( id_promo:number ){
    if(window.confirm("Seguro de querer eliminar ésta promoción?")){
      this.boletosService.eliminarPromoCodigo(id_promo).subscribe( datos => {
        if(datos['resultado'] == "ERROR"){
          console.log("ERROR");
          return
        }
        else if(datos['resultado'] == "OK"){
          this.refresh();
        }
      })
    }
  }

  eliminarPromoReferencia( id_promo:number ){
    if(window.confirm("Seguro de querer eliminar ésta promoción?")){
      this.boletosService.eliminarPromoReferencia(id_promo).subscribe( datos => {
        if(datos['resultado'] == "ERROR"){
          console.log("ERROR");
          return
        }
        else if(datos['resultado'] == "OK"){
          this.refresh();
        }
      })
    }
  }
}
