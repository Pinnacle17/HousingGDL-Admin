import { Component, OnInit, ViewChild } from '@angular/core';
import { CasasService } from 'src/app/services/casas.service';
import { CuartosService } from 'src/app/services/cuartos.service';

@Component({
  selector: 'app-semestres',
  templateUrl: './semestres.component.html',
  styleUrls: ['./semestres.component.css']
})
export class SemestresComponent implements OnInit {

  @ViewChild('cerrar', {static: false}) cerrar;
  @ViewChild('modalSemestre', {static: false}) modalSemestre;

  semestres:any=[];
  
  constructor(private cuartosService:CuartosService, private casasService:CasasService) { }

  ngOnInit(): void {
    this.getSemestres();
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
          window.alert("Semestre eliminado");
          this.getSemestres();
        }else{
          window.alert("El semestre no se puede eliminar porque tienes ofertas con este semestre");
        }
      })
    }
  }

  agregarSemestre(){

  }

}
