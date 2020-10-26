import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuartosService } from '../../services/cuartos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CasasService } from '../../services/casas.service';
import { environment } from 'src/environments/environment'
import { async, RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-boleto-editar',
  templateUrl: './boleto-editar.component.html'
})
export class BoletoEditarComponent implements OnInit {
  imgUrl = environment.imgUrl

  @ViewChild('cerrarCodigo') cerrarCodigo;
  @ViewChild('cerrarFechas') cerrarFechas;
  @ViewChild('cerrarReferencia') cerrarReferencia;
  @ViewChild('imgInputPriCua') imgInputPriCua: ElementRef;
  @ViewChild('imgsInputCua') imgsInputCua: ElementRef;
  //
  //
  cuarto:any = {};
  //
  //
  formInfoCuarto: FormGroup;
  formImgCuarto: FormGroup;
  formOferta: FormGroup;
  //
  imgPrincipalSeleccionadaCuarto: File = null;
  imgsSeleccionadasCuarto: File[] = [];
  listaImgCuarto: any[] = [];
  //
  urlsCuarto = [];
  urlPrincipalCuarto = null;
  //
  mensajeError:string = null;
  //
  semestres:any = null;
  //
  eventos:any = null;
  boletos:any = null;
  promosCodigo:any = null;
  promosFechas:any = null;
  promosReferencia:any = null;

  errorCodigo:string = "";
  id_evento:number = null;
  //
  id_casa:number = null;
  //
  infoBoleto:any = {
    id:null,
    nombre:null,
    desc:null,
    inventario:null,
    precio:null
  }
  //
  infoCuarto:any = {
    id_cuarto:null,
    nombre_cuarto:null,
    descripcion_cuarto:null,
  }

  imgsCuarto:any = {
    id_cuarto:null,
    imgPrincipal:null,
    imgs:null,
  }

  infoOferta:any = {
    id_cuarto:null,
    id_semestre:null,
    nombre_cuarto:null,
    descripcion_cuarto:null,
  }
  constructor(private activatedRoute:ActivatedRoute,
              private cuartosService:CuartosService,
              private fb:FormBuilder,
              private eventosService:CasasService) { }

  ngOnInit() {
    this.getSemestres();
    this.formInfoCuartoInit();
    this.formImgInit();
    this.activatedRoute.params.subscribe( params => {
      this.cuartosService.getCuarto(params['id']).subscribe( resultado => {

        this.cuarto = resultado[0];

        this.formInfoCuarto.setValue({
          nombre_cuarto:this.cuarto.nombre_cuarto,
          descripcion_cuarto:this.cuarto.descripcion_cuarto,
        });
      });

      this.infoCuarto.id = params['id'];

      this.infoOferta.id_cuarto = params['id'];
      this.imgsCuarto.id_cuarto = params['id'];

    });

  }

  formInfoCuartoInit(){
    this.formInfoCuarto = this.fb.group({
      nombre_cuarto:['', [Validators.required]],
      descripcion_cuarto:['', [Validators.required]],
    })
  }
  formImgInit() {
    this.formImgCuarto = this.fb.group({
      imgPrincipalCuarto: ['', RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })],
      imgsCuarto: ['', RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })]
    })
  }
  formOfertaInit(){
    this.formOferta = this.fb.group({
      id_semestre:[null],
      grupo:['', [Validators.required]],
      precio:['', [Validators.required]],
    })
  }

  get validacionNombre() {
    return this.formInfoCuarto.get('nombre_cuarto').invalid && this.formInfoCuarto.get('nombre_cuarto').touched;
  }

  get validacionDesc() {
    return this.formInfoCuarto.get('descripcion_cuarto').invalid && this.formInfoCuarto.get('descripcion_cuarto').touched;
  }

  get validacionTamImgPCuarto() {
    return this.formImgCuarto.get('imgPrincipalCuarto').invalid && this.formImgCuarto.get('imgPrincipal').dirty
  }

  get validacionTamImgsCuarto() {
    return this.formImgCuarto.get('imgsCuarto').invalid
  }
  get validacionPrecio() {
    return this.formOferta.get('precio').invalid && this.formOferta.get('precio').touched;
  }

  get validacionGrupo() {
    return this.formOferta.get('grupo').invalid && this.formOferta.get('grupo').touched;
  }

  refresh(){
    this.activatedRoute.params.subscribe( params => {
      this.cuartosService.getCuarto(params['id']).subscribe( resultado => this.cuarto = resultado[0]);
    });
  }

  guardarInfoCuarto(){
    this.infoCuarto.nombre_cuarto = this.formInfoCuarto.get('nombre_cuarto').value;
    this.infoCuarto.descripcion_cuarto = this.formInfoCuarto.get('descripcion_cuarto').value;
        this.cuartosService.modificarInfoCuarto(this.infoCuarto).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            console.log("ERROR");
            return
          }
          else if(datos['resultado'] == "OK"){
            this.refresh();
            window.confirm("Cuarto Modificado con exito modificado con éxito");
          }
        })
  }

  getSemestres(){
    this.cuartosService.getSemestres().subscribe( resultado => {
      this.semestres = resultado
      console.log(this.semestres );
    });
  }

  guardarOferta() {
    this.infoOferta.precio = this.formOferta.get('precio').value;
    this.infoOferta.grupo = this.formOferta.get('grupo').value;
    this.infoOferta.id_semestre = this.formOferta.get('id_semestre').value;
    this.cuartosService.crearOferta(this.infoOferta).subscribe(datos => {
      if (datos['resultado'] == 'OK') {
        this.formOferta.reset();
      }
    });
  }

  eliminarOferta( id_oferta:number ){
    if(window.confirm("Seguro que quiere eliminar ésta oferta?")){
      this.cuartosService.eliminarOferta(id_oferta).subscribe( datos => {
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
  eliminarImgCuarto(id: number) {
    console.log(id)
    if (confirm("Está seguro de querer eliminar esta imagen?")) {
      this.cuartosService.eliminarImgCuarto(id).subscribe(datos => {
		    if (datos['resultado'] == "OK") {
          this.refresh();
		      window.confirm("Imagen eliminada con éxito");
        }
      })
    }
  }

  imgPrincipalCuarto(event) {
    this.imgPrincipalSeleccionadaCuarto = <File>event.target.files[0];
    this.formImgCuarto.controls['imgPrincipalCuarto'].setValue(this.imgPrincipalSeleccionadaCuarto);

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
    this.formImgCuarto.controls['imgPrincipal'].setValue("");
    this.imgInputPriCua.nativeElement.value = null;
  }
  guardarImg() {
    this.imgsCuarto.imgPrincipal = this.imgPrincipalSeleccionadaCuarto;
    this.imgsCuarto.imgs = this.imgsSeleccionadasCuarto;
    this.cuartosService.modificarImgsCuarto(this.imgsCuarto).subscribe(datos => {
      if (datos['resultado'] == "ERROR") {
        console.log("ERROR");
        return
      } else if (datos['resultado'] == "OK") {
        this.refresh();

        this.borrarImgPrincipalCuarto();
        this.urlsCuarto = [];
        this.imgsSeleccionadasCuarto = [];
        this.imgsInputCua.nativeElement.value = null;
        window.confirm("Imagen(es) modificada(s) con éxito");
      }
    });
  }

}
