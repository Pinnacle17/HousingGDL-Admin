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
import { EventosComponent } from './components/eventos/eventos.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { RepartidoresComponent } from './components/repartidores/repartidores.component';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { EventoEditarComponent } from './components/eventoEditar/eventoEditar.component';
import { PublicacionEditarComponent } from './components/publicacion-editar/publicacion-editar.component';
import { PerfilComponent } from './components/perfil/perfil.component';

import { UsuariosService } from './services/usuarios.service';
import { EventosService } from './services/eventos.service';
import { PublicacionesService } from './services/publicaciones.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { BoletoEditarComponent } from './components/boleto-editar/boleto-editar.component';
import { RepartidorEditarComponent } from './components/repartidor-editar/repartidor-editar.component';
import { BoletosService } from './services/boletos.service';
import { RepartidoresService } from './services/repartidores.service';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { UsuarioVerComponent } from './components/usuario-ver/usuario-ver.component';
import { CompraVerComponent } from './components/compra-ver/compra-ver.component';

registerLocaleData(es)

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    EventosComponent,
    PublicacionesComponent,
    UsuariosComponent,
    RepartidoresComponent,
    EventoEditarComponent,
    PublicacionEditarComponent,
    PerfilComponent,
    BoletoEditarComponent,
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
    EventosService,
    PublicacionesService,
    BoletosService,
    RepartidoresService,
    { provide: LOCALE_ID, useValue: 'es-Mx' },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
