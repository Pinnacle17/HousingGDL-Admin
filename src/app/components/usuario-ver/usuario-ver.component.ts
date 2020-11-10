import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-usuario-ver',
  templateUrl: './usuario-ver.component.html'
})
export class UsuarioVerComponent implements OnInit {

  constructor(private usuariosService:UsuariosService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private loginService: LoginService) { }

  usuario:any = {};
  chat:any = {};
  historial:any = [];
  hayCompras:boolean = null;
  loggedIn:boolean = false;

  ngOnInit(): void {
    this.loggedIn = this.loginService.getEstadoSesion();
    if (this.loggedIn == false  && localStorage.getItem("id_admin") === null) {
        this.router.navigate(['login'])
    }
    this.activatedRoute.params.subscribe(params => {
      this.usuariosService.getUsuario(params['id']).subscribe( resultado => {
        this.usuario = resultado;

        console.log(this.usuario);
      });
      this.loginService.verVentas(params['id']).subscribe(resultado => {
        console.log(resultado)
        if(resultado != null){
          this.hayCompras = true;
          this.historial = resultado;
          console.log(this.historial);
        }
        else{
          this.hayCompras = false;
        }
      })
    })

  }
  verChat(id: number) {
    this.router.navigate(['chat', id])
  }
  activarUsuario(id: number) {
      this.loginService.verChatUsuario(id).subscribe(datos => {
        this.chat = datos;
      });

  }
}
