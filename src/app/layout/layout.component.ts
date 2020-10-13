import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  id:string = null;
  usuario:any = {};

  constructor(private usuariosService:UsuariosService,
              private router:Router) { }

  ngOnInit(): void {
    this.id = localStorage.getItem("id_admin");
    if(this.id == null  || this.usuario == {}){
      this.cerrarSesion();
    }
    this.getAdmin();
  }

  getAdmin(){
    this.usuariosService.getAdmin(Number(this.id)).subscribe( resultado => {
        this.usuario = resultado[0];
    })
  }

  cerrarSesion(){
    localStorage.removeItem("id_admin");
    this.router.navigate(['login'])
  }
}
