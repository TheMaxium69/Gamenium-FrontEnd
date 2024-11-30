import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ProfilService} from "../../-service/profil.service";
import {ProfilInterface} from "../../-interface/profil.interface";

@Component({
  selector: 'modal-view-mygame',
  templateUrl: './view-mygame.component.html',
  styleUrls: ['./view-mygame.component.css']
})
export class ViewMygameComponent {

  constructor(
    protected app:AppComponent) {}

  @Input()
  isColor: string = this.app.colorDefault;

  profilSelected: ProfilInterface | undefined;

}
