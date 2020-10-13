import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-compra-ver',
  templateUrl: './compra-ver.component.html'
})
export class CompraVerComponent implements OnInit {

  elementosVenta:any = null;
  id_evento:number = null;

  constructor(private activatedRoute:ActivatedRoute,
              private usuariosService:UsuariosService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id_evento = params['id']
      this.usuariosService.elementosVenta(params['id']).subscribe(resultado => {
        this.elementosVenta = resultado;
        console.log(this.elementosVenta);
      });
    });
  }

}
