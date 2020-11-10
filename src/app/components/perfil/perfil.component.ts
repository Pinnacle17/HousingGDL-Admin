import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  admin:any = {};
  id:string = null;
  loggedIn:boolean = false;

  constructor(private usuariosService:UsuariosService,
              private router:Router, private loginService: LoginService) { }

  ngOnInit() {
    this.loggedIn = this.loginService.getEstadoSesion();
    if (this.loggedIn == false  && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
    this.id = localStorage.getItem("id_admin")
    this.getAdmin();
  }

  getAdmin(){
    this.usuariosService.getAdmin(Number(this.id)).subscribe( resultado => {
        this.admin = resultado[0];
    })
  }

  cerrarSesion(){
    localStorage.removeItem("id_admin");
    this.loginService.setEstadoSesion(false);
    this.router.navigate(['login'])
  }

}
