import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CasasComponent } from './components/casas/casas.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { RepartidoresComponent } from './components/repartidores/repartidores.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CasaEditarComponent } from './components/casaEditar/casaEditar.component';
import { PublicacionEditarComponent } from './components/publicacion-editar/publicacion-editar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CuartoEditarComponent } from './components/cuarto-editar/cuarto-editar.component';
import { RepartidorEditarComponent } from './components/repartidor-editar/repartidor-editar.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UsuarioVerComponent } from './components/usuario-ver/usuario-ver.component';
import { CompraVerComponent } from './components/compra-ver/compra-ver.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    { path: 'inicio', component: InicioComponent },
    { path: 'casas', component: CasasComponent },
    { path: 'publicaciones', component: PublicacionesComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'ver-usuario/:id', component: UsuarioVerComponent },
    { path: 'ver-compra/:id', component: CompraVerComponent },
    { path: 'repartidores', component: RepartidoresComponent },
    { path: 'editar-casa/:id', component: CasaEditarComponent },
    { path: 'editar-publicacion/:id', component: PublicacionEditarComponent },
    { path: 'editar-cuarto/:id', component: CuartoEditarComponent },
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
