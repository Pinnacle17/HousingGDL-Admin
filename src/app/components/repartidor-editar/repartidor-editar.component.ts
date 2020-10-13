import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RepartidoresService } from '../../services/repartidores.service';
import { BoletosService } from 'src/app/services/boletos.service';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-repartidor-editar',
  templateUrl: './repartidor-editar.component.html'
})
export class RepartidorEditarComponent implements OnInit {

  formInfo:FormGroup;
  formStock:FormGroup;

  repartidor:any = {};

  id_evento:number = null;

  boletos:any = null;
  boletosTodos:any = null;
  boletosRep:any = null;

  eventos:any = null;

  historial:any = null;


  constructor(private fb:FormBuilder,
              private activatedRoute:ActivatedRoute,
              private repartidoresService:RepartidoresService,
              private boletosService:BoletosService,
              private eventosService:EventosService
              ) { }

  ngOnInit() {
    this.getEventos();
    this.getBoletosTodos();
    this.formInfoInit();
    this.formsStockInit();
    this.activatedRoute.params.subscribe( params => {

      this.repartidoresService.getRepartidor(params['id']).subscribe( resultado => {
        this.repartidor = resultado[0];

        this.formInfo.setValue({
          id:params['id'],
          nombre: this.repartidor.nombre.split(" ")[0],
          apellidoP: this.repartidor.nombre.split(" ")[1],
          apellidoM: this.repartidor.nombre.split(" ")[2],
          correo: this.repartidor.correo,
          telefono: this.repartidor.celular,
          telefonoExt: this.repartidor.celular_ext,
          contra: null,
          contra2: null
        })
      })

      this.repartidoresService.getHistorial(params['id']).subscribe( resultado => {
        this.historial = resultado;
        console.log(this.historial);
      });
      this.repartidoresService.getBoletos(params['id']).subscribe( resultado => this.boletosRep = resultado );

      this.formInfo.addControl('id', this.fb.control(null));
      this.formStock.addControl('id_repartidor', this.fb.control(null));
      this.formStock.get('id_repartidor').setValue(params['id']);
    })
  }

  formInfoInit(){
    this.formInfo = this.fb.group({
      nombre:[''],
      apellidoP:[''],
      apellidoM:[''],
      correo:['', Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')],
      telefono:[''],
      telefonoExt:[''],
      contra:['', Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$')],
      contra2:['', Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$')]
    })
  }

  formsStockInit(){
    this.formStock = this.fb.group({
      stock:[0],
      boleto:[null]
    });
  }

  getBoletosTodos(){
    this.boletosService.getBoletosTodos().subscribe(resultado => this.boletosTodos = resultado)
  }

  get validacionCorreo(){
    return this.formInfo.get('correo').invalid && this.formInfo.get('correo').touched
  }

  get validacionNumero(){
    return this.esAlfa(this.formInfo.get('telefono').value) && this.formInfo.get('telefono').value != ""
  }

  get validacionNumeroExtra(){
    return this.esAlfa(this.formInfo.get('telefonoExt').value) && this.formInfo.get('telefonoExt').value != ""
  }

  get validacionContra(){
    return this.formInfo.get('contra').invalid && this.formInfo.get('contra').touched
  }

  esAlfa(str) {
    if(str != null){
      if (!str.match(/^[0-9]+$/)){
        return true
      }
      else{
        return false
      }
    }
  }

  guardarInfo(){
    console.log(this.formInfo.value);
    this.repartidoresService.modificarRepartidor(this.formInfo.value).subscribe( datos => {
      if(datos['resultado'] == "ERROR"){
        console.log("ERROR");
        return
      }else if(datos['resultado'] == "OK"){
        this.activatedRoute.params.subscribe( params => {
          this.repartidoresService.getRepartidor(params['id']).subscribe( resultado =>  this.repartidor = resultado[0]);
        });
        window.confirm("Información modificada con éxito");
      }
    })

  }

  passNoValida(){
    const P1 = this.formInfo.get('contra').value;
    const P2 = this.formInfo.get('contra2').value;

    if(P1 === P2){
      return false
    }
    else{
      this.formInfo.get('contra2').setErrors({'invalid':true})
      return true
    }
  }

  getEventos(){
    this.eventosService.getEventos(2).subscribe( resultado => {
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

  refresh(){
    this.getBoletosTodos();
    this.getEventos();
    this.activatedRoute.params.subscribe( params => {
      this.repartidoresService.getHistorial(params['id']).subscribe( resultado => this.historial = resultado);
      this.repartidoresService.getBoletos(params['id']).subscribe( resultado => this.boletosRep = resultado );
    })
  }

  guardarStock(){
    console.log(this.formStock.value);

    this.repartidoresService.insertarStock(this.formStock.value).subscribe( datos => {
      if(datos['estado'] == 0){
        window.confirm(datos['mensaje']);
        return
      }
      else{
        if(datos['resultado'] == 'ERROR'){
          window.confirm("Ocurrió un error inesperado");
          return
        }
        else if( datos['resultado'] == 'OK'){
          window.confirm("Boletos agregados con éxito");
          this.refresh();
        }
      }
    })
  }
}
