import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { RepartidoresComponent } from './components/repartidores/repartidores.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { EventoEditarComponent } from './components/eventoEditar/eventoEditar.component';
import { PublicacionEditarComponent } from './components/publicacion-editar/publicacion-editar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BoletoEditarComponent } from './components/boleto-editar/boleto-editar.component';
import { RepartidorEditarComponent } from './components/repartidor-editar/repartidor-editar.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UsuarioVerComponent } from './components/usuario-ver/usuario-ver.component';
import { CompraVerComponent } from './components/compra-ver/compra-ver.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    { path: 'inicio', component: InicioComponent },
    { path: 'eventos', component: EventosComponent },
    { path: 'publicaciones', component: PublicacionesComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'ver-usuario/:id', component: UsuarioVerComponent },
    { path: 'ver-compra/:id', component: CompraVerComponent },
    { path: 'repartidores', component: RepartidoresComponent },
    { path: 'editar-evento/:id', component: EventoEditarComponent },
    { path: 'editar-publicacion/:id', component: PublicacionEditarComponent },
    { path: 'editar-boleto/:id', component: BoletoEditarComponent },
    { path: 'editar-repartidor/:id', component: RepartidorEditarComponent },
    { path: 'perfil', component: PerfilComponent },
  ]},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
