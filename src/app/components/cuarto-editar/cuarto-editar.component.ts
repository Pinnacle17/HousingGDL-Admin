import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuartosService } from '../../services/cuartos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CasasService } from '../../services/casas.service';
import { environment } from 'src/environments/environment'
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuarto-editar',
  templateUrl: './cuarto-editar.component.html'
})
export class CuartoEditarComponent implements OnInit {
  imgUrl = environment.imgUrl

  @ViewChild('cerrarCodigo') cerrarCodigo;
  @ViewChild('cerrarFechas') cerrarFechas;
  @ViewChild('cerrarReferencia') cerrarReferencia;
  @ViewChild('imgInputPriCua') imgInputPriCua: ElementRef;
  @ViewChild('imgsInputCua') imgsInputCua: ElementRef;
  //
  //

  loggedIn:boolean = false;


  cuarto:any = {};
  oferta:any = {};
  //
  //
  formInfoCuarto: FormGroup;
  formImgCuarto: FormGroup;
  formOferta: FormGroup;
  formImgE: FormGroup;
  //
  imgPrincipalSeleccionadaCuarto: File = null;
  imgsSeleccionadasCuarto: File[] = [];
  listaImgCuarto: any[] = [];
  //
  urlsCuarto = [];
  badUrls = [];
  urlPrincipalCuarto = null;
  //
  sinImagen: boolean = false;
  errorTamImgs: boolean = false;
  //
  mensajeError:string = null;
  //
  semestres:any = null;
  //
  id_cuarto:number = null;
  id_semestre:number = null;
  //

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

  imgs:any = null;

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

  editandoOferta=false;
  id_oferta=null;

  constructor(private activatedRoute:ActivatedRoute,
              private cuartosService:CuartosService,
              private fb:FormBuilder,
              private casasService:CasasService,
              private loginService: LoginService,
              private router:Router) { }

  ngOnInit() {
    this.loggedIn = this.loginService.getEstadoSesion();
    if (this.loggedIn == false  && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
    // this.getSemestres();
    this.formInfoCuartoInit();
    this.formImgInit();
    this.formOfertaInit();
    this.activatedRoute.params.subscribe( params => {
      this.cuartosService.getCuarto(params['id']).subscribe( resultado => {

        this.cuarto = resultado[0];
        console.log(this.cuarto.descripcion_cuarto)

        this.formInfoCuarto.patchValue({
          nombre_cuarto:this.cuarto.nombre_cuarto,
          descripcion_cuarto:this.cuarto.descripcion_cuarto,
        });

        console.log(this.formInfoCuarto.get('nombre_cuarto').value)
      });
      this.cuartosService.getImgs(params['id']).subscribe(resultado => {
        this.imgs = resultado
        console.log(this.imgs)
      });
      this.cuartosService.getSemestres().subscribe(resultado => {
        this.semestres = resultado
      });
      this.infoCuarto.id = params['id'];
      this.infoCuarto.id_cuarto = params['id'];
      this.infoOferta.id_cuarto = params['id'];
      this.imgsCuarto.id_cuarto = params['id'];
      this.id_cuarto = params['id'];
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
      imgPrincipal: ['', RxwebValidators.image({ minHeight: 690, maxHeight: 2160, minWidth: 950, maxWidth: 4096 })],
      imgsCuarto: ['']
    })
  }
  formOfertaInit(){
    this.formOferta = this.fb.group({
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
    return this.formImgCuarto.get('imgPrincipal').invalid && this.formImgCuarto.get('imgPrincipal').dirty
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
      this.cuartosService.getImgs(params['id']).subscribe(resultado => {
        this.imgs = resultado
        console.log(this.imgs)
      });
    });
  }

  guardarInfoCuarto(){
    this.infoCuarto.nombre_cuarto = this.formInfoCuarto.get('nombre_cuarto').value;
    this.infoCuarto.descripcion_cuarto = this.formInfoCuarto.get('descripcion_cuarto').value;
    console.log(this.infoCuarto)
        this.cuartosService.modificarInfoCuarto(this.infoCuarto).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            console.log("ERROR");
            return
          }
          else if(datos['resultado'] == "OK"){
            this.refresh();
            window.confirm("Cuarto modificado con éxito");
          }
        })
  }

  // getSemestres(){
  //   this.cuartosService.getSemestres().subscribe( resultado => {
  //     this.semestres = resultado
  //     console.log(this.semestres );
  //   });
  // }


  eliminarImgCuarto(id: number) {
    if(this.imgs.length < 2){
      window.confirm("No se puede eliminar, debe de haber minimo una imagen")
    }else{
      if (confirm("Está seguro de querer eliminar esta imagen?")) {
        this.cuartosService.eliminarImgCuarto(id).subscribe(datos => {
          if (datos['resultado'] == "OK") {
            this.refresh();
            window.confirm("Imagen eliminada con éxito");
          }
        })
      }
    }

  }

  imgPrincipalCuarto(event) {
    this.imgPrincipalSeleccionadaCuarto = <File>event.target.files[0];
    this.formImgCuarto.controls['imgPrincipal'].patchValue(this.imgPrincipalSeleccionadaCuarto);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event: any) => {
        //console.log(event.target.result);
        this.urlPrincipalCuarto = event.target.result;
      }
    }
  }
  borrarImgs(url: any, index: number) {
    this.urlsCuarto = this.urlsCuarto.filter((a) => a !== url);
    this.listaImgCuarto.splice(index, 1);
    this.imgsSeleccionadasCuarto.splice(index, 1);

    this.formImgE.controls['imgsCasa'].reset();

    console.log(this.formImgE.get('imgsCasa').value);
    if (this.imgsSeleccionadasCuarto.length == 0) {
      this.formImgE.controls['imgsCasa'].setValue("");
      this.imgsInputCua.nativeElement.value = null;
    }

    console.log(this.formImgE);
  }

  multiImg(event) {
    if(event.target.files && event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {

        var reader = new FileReader();
        let file = event.target.files[i];
        let img = new Image();

        img.src = window.URL.createObjectURL(file);

        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {

          const alto = img.naturalHeight;
          const ancho = img.naturalWidth;

          window.URL.revokeObjectURL(file);

          if(alto < 690 || alto > 2160 || ancho < 950 ||ancho > 4096){
            this.errorTamImgs = true;
            this.badUrls.push(file.name)
          }
          else{
            this.urlsCuarto.push(event.target.result);
            this.imgsSeleccionadasCuarto.push(file);
            this.listaImgCuarto.push(file.name);
            this.formImgCuarto.controls['imgsCuarto'].setValue(this.imgsSeleccionadasCuarto);
          }
        };

        this.sinImagen = false;
      }
    }
    else{
      this.sinImagen = true;
      return
    }
    console.log(this.formImgCuarto.get('imgsCuarto').value);
  }

  borrarImgPrincipalCuarto() {
    this.urlPrincipalCuarto = null;
    this.formImgCuarto.controls['imgPrincipal'].setValue("");
    this.imgInputPriCua.nativeElement.value = null;
  }
  guardarImg() {
    this.imgsCuarto.imgPrincipal = this.imgPrincipalSeleccionadaCuarto;
    this.imgsCuarto.imgs = this.imgsSeleccionadasCuarto;
    this.imgsCuarto.id_cuarto=this.cuarto.id_cuarto;
    console.log(this.imgsCuarto)
    if((this.imgs.length + this.imgsSeleccionadasCuarto.length) < 10){
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
    }else{
      window.confirm("El cuarto no puede tener mas de 10 imagenes");
    }

  }
  getOferta( event:any ){
    this.id_semestre = event
    if(this.id_semestre != null){
      this.cuartosService.getOferta(this.id_semestre, this.id_cuarto).subscribe( resultado =>{
        console.log(resultado)
        this.oferta = resultado
        console.log(this.oferta.celular)

      } )
    }
    else{
      return
    }
  }

  guardarOferta() {
    console.log(this.formOferta.get('precio').value)
    this.infoOferta.precio = this.formOferta.get('precio').value;
    this.infoOferta.grupo = this.formOferta.get('grupo').value;
    this.infoOferta.id_semestre = this.id_semestre;

    if(this.editandoOferta==false){
      this.cuartosService.crearOferta(this.infoOferta).subscribe(datos => {
        if (datos['resultado'] == 'OK') {
          this.formOferta.reset();
          this.oferta['precio'] = this.infoOferta.precio;
          this.oferta['grupo'] = this.infoOferta.grupo;
          this.oferta['fk_oferta'] = datos['oferta'];
          this.oferta['tipo'] = 1;
        }
      });
    }else{
      this.cuartosService.modificarOferta(this.formOferta.value,this.id_oferta).subscribe(resultado=>{
        if(resultado==true){
          this.editandoOferta=false;
          this.oferta['precio'] = this.infoOferta.precio;
          this.oferta['grupo'] = this.infoOferta.grupo;
          window.alert("Oferta modificada");
        }else{
          this.editandoOferta=false;
          window.alert("Ha ocurrido un error. Intentelo más tarde");
        }
      })
    }


  }

  eliminarOferta( id_oferta:number ){
    if(window.confirm("Seguro que quiere eliminar ésta oferta?")){
      this.cuartosService.eliminarOferta(id_oferta).subscribe( datos => {
          this.formOferta.reset();
          this.oferta['tipo'] = 0;
      })
    }
  }

  editarOferta(id_oferta){
    this.id_oferta=id_oferta
    this.editandoOferta=true;
    this.formOferta.controls['precio'].setValue(this.oferta.precio);
    this.formOferta.controls['grupo'].setValue(this.oferta.grupo);
  }

}
