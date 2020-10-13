import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  admin:any = {};
  id:string = null;

  constructor(private usuariosService:UsuariosService,
              private router:Router) { }

  ngOnInit() {
    // this.id = localStorage.getItem("id_admin")
    // this.getAdmin();
  }

  getAdmin(){
    this.usuariosService.getAdmin(Number(this.id)).subscribe( resultado => {
        this.admin = resultado[0];
    })
  }

  cerrarSesion(){
    localStorage.removeItem("id_admin");
    this.router.navigate(['login'])
  }

}
