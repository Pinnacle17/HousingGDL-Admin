import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ActivatedRoute } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicacion-editar',
  templateUrl: './publicacion-editar.component.html'
})
export class PublicacionEditarComponent implements OnInit {

  formInfoP:FormGroup;
  formImgP:FormGroup;

  urls = [];
  urlPrincipal = null;

  publicacion:any = {};
  imgs:any = null;

  infoPub:any = {
    id:null,
    titulo:null,
    articulo:null,
  }

  imgsPub:any = {
    id:null,
    imgPrincipal:null,
    imgsPublicacion:null
  }

  imgSeleccionada: File;
  imgsSeleccionadas:File[] = [];
  listaImg:any[] = [];

  errorNombre:string = "";

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['Anterior', 'Siguiente'],
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
  @ViewChild('imgsInput') imgsInput:ElementRef;

  constructor( private fb:FormBuilder,
               private activatedRoute:ActivatedRoute,
               private publicacionesService:PublicacionesService ) {}

  ngOnInit() {
    this.formInfoPInit();
    this.formImgPInit();
    this.activatedRoute.params.subscribe( params => {
      this.publicacionesService.getPublicacion(params['id']).subscribe( resultado => {
        this.publicacion = resultado[0];

        this.formInfoP.setValue({
          titulo:this.publicacion.titulo_pub,
          articulo:this.publicacion.articulo_pub
        })

      });
      this.publicacionesService.getImgs(params['id']).subscribe( resultado => this.imgs = resultado);

      this.infoPub.id = params['id'];
      this.imgsPub.id = params['id'];
    })
  }

  formInfoPInit(){
    this.formInfoP = this.fb.group({
      titulo:[''],
      articulo:['']
    })
  }

  formImgPInit(){
    this.formImgP = this.fb.group({
      imgPrincipal:['', RxwebValidators.image({minHeight:690, maxHeight:2160, minWidth:950, maxWidth:4096})],
      imgsPublicacion:['', RxwebValidators.image({minHeight:690, maxHeight:2160, minWidth:950, maxWidth:4096})]
    })
  }

  borrarImgPrincipal(){
    this.urlPrincipal = null;
    this.formImgP.controls['imgPrincipal'].setValue("");
    this.imgInputP.nativeElement.value = null;
  }

  borrarImgs( url:any, index:number ){
    this.urls = this.urls.filter((a) => a !== url);
    this.listaImg.splice(index, 1);
    this.imgsSeleccionadas.splice(index, 1);

    this.formImgP.controls['imgsPublicacion'].reset();
    this.formImgP.controls['imgsPublicacion'].setValue(this.imgsSeleccionadas);


    if(this.imgsSeleccionadas.length == 0){
      this.formImgP.controls['imgsPublicacion'].setValue("");
      this.imgsInput.nativeElement.value = null;
    }
  }

  get validacionTamImg(){
    return this.formImgP.get('imgPrincipal').invalid && this.formImgP.get('imgPrincipal').dirty
  }

  get validacionTamImgs(){
    return this.formImgP.get('imgsPublicacion').invalid && this.formImgP.get('imgsPublicacion').dirty
  }

  refresh(){
    this.activatedRoute.params.subscribe( params => {
      this.publicacionesService.getPublicacion(params['id']).subscribe( resultado => this.publicacion = resultado[0]);
      this.publicacionesService.getImgs(params['id']).subscribe( resultado => this.imgs = resultado);
    });
  }

  guardarInfo(){
    this.infoPub.titulo = this.formInfoP.get('titulo').value;
    this.infoPub.articulo = this.formInfoP.get('articulo').value;

    this.publicacionesService.buscarNombre(this.formInfoP.get('titulo').value, this.infoPub.id).subscribe(datos => {
      if(datos['estado'] == 0){
        this.errorNombre = datos['mensaje'];
        window.confirm(this.errorNombre);
        return
      }
      else if(datos['estado'] == 1){
        this.publicacionesService.modificarInfoPub(this.infoPub).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            console.log("ERROR");
            return
          }
          else if(datos['resultado'] == "OK"){
            this.refresh();
            window.confirm("Información modificada con éxito")
          }
        })
      }
    });
  }

  guardarImg(){
    this.imgsPub.imgPrincipal = this.imgSeleccionada;
    this.imgsPub.imgsPublicacion = this.imgsSeleccionadas;

    this.publicacionesService.modificarImgsPub(this.imgsPub).subscribe( datos => {
      if(datos['resultado'] == "ERROR"){
        console.log("ERROR");
        return
      }
      else if(datos['resultado'] == "OK"){
        this.refresh();

        this.borrarImgPrincipal();

        this.urls = [];
        this.imgsSeleccionadas = [];
        this.imgsInput.nativeElement.value = null;
        window.confirm("Imagen(es) modificada(s) con éxito");
      }
    })
  }

  eliminarImg( id_img:number ){
    if(confirm("Está seguro de querer eliminar esta imagen?")){
      this.publicacionesService.eliminarImgs(id_img).subscribe( datos => {
        if(datos['resultado'] == "OK"){
          this.refresh();
        }
      })
    }
  }

  multiImg(event) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {

        var reader = new FileReader();

        reader.onload = (event:any) => {
          this.urls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);

        var selectedFile = event.target.files[i];
        this.imgsSeleccionadas.push(selectedFile);
        this.listaImg.push(selectedFile.name)
      }
    }

    this.formImgP.controls['imgsPublicacion'].setValue(this.imgsSeleccionadas);
  }

  imgPrincipal(event){
    this.imgSeleccionada = <File>event.target.files[0];
    this.formImgP.controls['imgPrincipal'].setValue(this.imgSeleccionada);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
          this.urlPrincipal = event.target.result;
      }
    }
  }
}
