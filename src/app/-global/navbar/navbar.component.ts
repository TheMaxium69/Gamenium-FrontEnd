import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import { ProfilService } from 'src/app/-service/profil.service';
import { ProfilInterface } from 'src/app/-interface/profil.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor( protected app: AppComponent ) { }

}
