import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CasasService } from 'src/app/services/casas.service';
import { CuartosService } from 'src/app/services/cuartos.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-semestres',
  templateUrl: './semestres.component.html',
  styleUrls: ['./semestres.component.css']
})
export class SemestresComponent implements OnInit {

  @ViewChild('cerrar', {static: false}) cerrar;
  @ViewChild('modalSemestre', {static: false}) modalSemestre;

  semestres:any=[];
  enviarForm: FormGroup;

  loggedIn:boolean = false;


  constructor(private router:Router, private cuartosService:CuartosService, private casasService:CasasService,private fb: FormBuilder, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loggedIn = this.loginService.getEstadoSesion();
    if (this.loggedIn == false && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
    this.formEnviarInit();
    this.getSemestres();
    let now=new Date();
    console.log(now)
  }

  get validacionNombre() {
    return this.enviarForm.get('nombre').invalid && this.enviarForm.get('nombre').touched
  }

  get validacionInicio() {
    return this.enviarForm.get('inicio').invalid && this.enviarForm.get('inicio').touched
  }

  get validacionFin() {
    return this.enviarForm.get('fin').invalid && this.enviarForm.get('fin').touched
  }

  formEnviarInit(){
    this.enviarForm = this.fb.group({
      nombre: [null, Validators.required],
      inicio: [null, Validators.required],
      fin: [null, Validators.required],
    })
  }

  getSemestres(){
    this.cuartosService.getSemestres().subscribe(resultado=>{
      this.semestres=resultado
    })
  }

  borrarSemestre( id_semestre ){
    if(window.confirm("¿Esta seguro de querer eliminar este semestre?")){
      this.casasService.eliminarSemestre(id_semestre).subscribe(resultado=>{
        if(resultado==true){
          this.getSemestres();
          window.alert("Semestre eliminado");
        }else{
          window.alert("El semestre no se puede eliminar porque tienes ofertas con este semestre");
        }
      })
    }
  }

  agregarSemestre(){
    let now=new Date();
    let fin=new Date(this.enviarForm.get("fin").value)
    if(this.enviarForm.get("inicio").value>=this.enviarForm.get("fin").value || fin<now){
      window.alert("Fechas incorrectas")
    }else{
      this.casasService.crearSemestre(this.enviarForm.value).subscribe(resultado=>{
        console.log(resultado)
        if(resultado==true){
          //window.alert("semesre")
          this.cerrar.nativeElement.click();
          this.getSemestres();
        }else{
          window.alert("Ha ocurrido un error. Intentelo más tarde")
        }
      })
    }
  }

}
