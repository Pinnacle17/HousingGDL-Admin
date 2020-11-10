import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra-ver',
  templateUrl: './compra-ver.component.html'
})
export class CompraVerComponent implements OnInit {
  loggedIn:boolean = false;


  elementosVenta:any = null;
  id_evento:number = null;

  constructor(private activatedRoute:ActivatedRoute,
              private usuariosService:UsuariosService,
              private loginService: LoginService,
              private router:Router) { }

  ngOnInit(): void {
    this.loggedIn = this.loginService.getEstadoSesion();
    if (this.loggedIn == false && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
    this.activatedRoute.params.subscribe(params => {
      this.id_evento = params['id']
      // this.usuariosService.elementosVenta(params['id']).subscribe(resultado => {
      //   this.elementosVenta = resultado;
      //   console.log(this.elementosVenta);
      // });
    });
  }

}
