import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CasasComponent } from './components/casas/casas.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CasaEditarComponent } from './components/casaEditar/casaEditar.component';
import { PublicacionEditarComponent } from './components/publicacion-editar/publicacion-editar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CuartoEditarComponent } from './components/cuarto-editar/cuarto-editar.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UsuarioVerComponent } from './components/usuario-ver/usuario-ver.component';
import { CompraVerComponent } from './components/compra-ver/compra-ver.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { SemestresComponent } from './components/semestres/semestres.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component'; 



const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    { path: 'inicio', component: InicioComponent },
    { path: 'casas', component: CasasComponent },
    { path: 'publicaciones', component: PublicacionesComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'ver-usuario/:id', component: UsuarioVerComponent },
    { path: 'ver-compra/:id', component: CompraVerComponent },
    { path: 'editar-casa/:id', component: CasaEditarComponent },
    { path: 'editar-publicacion/:id', component: PublicacionEditarComponent },
    { path: 'editar-cuarto/:id', component: CuartoEditarComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'chat-list', component: ChatListComponent},
    { path: 'chat/:id', component: ChatComponent },
    { path: 'semestres', component: SemestresComponent },
    { path: 'estadisticas', component: EstadisticasComponent },

  ]},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
