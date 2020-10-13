import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuario-ver',
  templateUrl: './usuario-ver.component.html'
})
export class UsuarioVerComponent implements OnInit {

  constructor(private usuariosService:UsuariosService,
              private activatedRoute:ActivatedRoute,
              private router:Router) { }

  usuario:any = {};
  historial:any = [];
  hayCompras:boolean = null;

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.usuariosService.getUsuario(params['id']).subscribe( resultado => {
        this.usuario = resultado;
        this.usuariosService.verVentas(this.usuario['id_usuario']).subscribe(resultado => {
          if(resultado != null){
            this.hayCompras = true;
            this.historial = resultado;
            console.log(this.historial);
          }
          else{
            this.hayCompras = false;
          }
        })

        console.log(this.usuario);
      });
    })
  }

  verCompra(id_compra:number){
    this.router.navigate(['ver-compra', id_compra]);
  }

}
