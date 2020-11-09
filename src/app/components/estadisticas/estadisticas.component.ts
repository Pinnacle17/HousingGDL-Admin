import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CasasService } from 'src/app/services/casas.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  tabActive=1;
  nacionalidades:any=[];
  casas:any=[];
  colonias:any=[];

  constructor(private casasService:CasasService, private router:Router ) { }

  ngOnInit(): void {
    this.casasService.getEstadisticasNacionalidades().subscribe(resultado=>{
      console.log(resultado)
      this.nacionalidades=resultado
    })
    this.casasService.getEstadisticasCasas().subscribe(resultado=>{
      console.log(resultado)
      this.casas=resultado
    })
    this.casasService.getEstadisticasColonias().subscribe(resultado=>{
      console.log(resultado)
      this.colonias=resultado
    })

  }

  mostrarNacionalidades(){
    this.tabActive=1;
  }
  
  mostrarCasas(){
    this.tabActive=2;
  }

  mostrarColonias(){
    this.tabActive=3;
  }

  editarCasa(id: number) {
    this.router.navigate(['editar-casa', id]);
  }
}
