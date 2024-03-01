import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AppComponent } from "../../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private app: AppComponent) { }

  login(form: NgForm){

    let email = form.value.email
    let password = form.value.password
    let saveme = form.value.saveme

    this.app.login(email, password, saveme);

  }


}
