import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loggedIn: boolean = false;
  formLogin: FormGroup;

  @ViewChild('modalLogin', { static: false }) modalLogin;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router) { }

  ngOnInit() {
    this.formLoginInit();
  }

  formLoginInit() {
    this.formLogin = this.fb.group({
      correo: [null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      contra: [null, Validators.required]
    })
  }

  get validacionCorreoL() {
    return this.formLogin.get('correo').invalid && this.formLogin.get('correo').touched
  }

  login() {
      /* FAKE_LOGINthis.loginService.login(this.formLogin.value).subscribe(datos => {
        if (datos['estado'] == 0) {
          console.log(datos);
          window.confirm(datos['mensaje']);
          return
        }
        else if (datos['estado'] == 1) {
          let id = datos['id_usuario'];

          localStorage.setItem("id_admin", id);

          this.router.navigate(['/inicio']);
        }
      })

      FAKE_LOGIN*/
      localStorage.setItem("id_admin", "1")
      this.router.navigate(['/inicio']);
      return



  }

}
