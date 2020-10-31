import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';
import {  RxReactiveFormsModule } from "@rxweb/reactive-form-validators"
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CasasComponent } from './components/casas/casas.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { RepartidoresComponent } from './components/repartidores/repartidores.component';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CasaEditarComponent } from './components/casaEditar/casaEditar.component';
import { PublicacionEditarComponent } from './components/publicacion-editar/publicacion-editar.component';
import { PerfilComponent } from './components/perfil/perfil.component';

import { UsuariosService } from './services/usuarios.service';
import { CasasService } from './services/casas.service';
import { PublicacionesService } from './services/publicaciones.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { CuartoEditarComponent } from './components/cuarto-editar/cuarto-editar.component';
import { RepartidorEditarComponent } from './components/repartidor-editar/repartidor-editar.component';
import { CuartosService } from './services/cuartos.service';
import { ChatsService } from './services/chats.service';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { UsuarioVerComponent } from './components/usuario-ver/usuario-ver.component';
import { CompraVerComponent } from './components/compra-ver/compra-ver.component';

registerLocaleData(es)

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CasasComponent,
    PublicacionesComponent,
    UsuariosComponent,
    RepartidoresComponent,
    CasaEditarComponent,
    PublicacionEditarComponent,
    PerfilComponent,
    CuartoEditarComponent,
    RepartidorEditarComponent,
    LayoutComponent,
    LoginComponent,
    UsuarioVerComponent,
    CompraVerComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RxReactiveFormsModule ,
    BrowserAnimationsModule,
    CarouselModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    ChartsModule
  ],
  providers: [
    UsuariosService,
    CasasService,
    PublicacionesService,
    CuartosService,
    ChatsService,
    { provide: LOCALE_ID, useValue: 'es-Mx' },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
