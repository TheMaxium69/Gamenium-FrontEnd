import {Component, Input, OnInit} from '@angular/core';
import { PlateformInterface } from 'src/app/-interface/plateform.interface';
import { AppComponent } from 'src/app/app.component';
import {HistoryMyPlatformInterface} from "../../-interface/history-my-platform.interface";

@Component({
  selector: 'app-card-platform',
  templateUrl: './card-platform.component.html',
  styleUrls: ['./card-platform.component.css']
})
export class CardPlatformComponent{


  @Input()
  public plateform: PlateformInterface|undefined;

  @Input()
  public hmp: HistoryMyPlatformInterface | undefined;

  @Input()
  public state: string | null = null;

  @Input()
  public nbGame: number | null = null;

  @Input()
  public nbPlatform: number | null = null;

  @Input()
  public colorProfil: string | undefined | null = null;

  @Input()
  public isPublic: boolean = false;

  constructor(
    protected app:AppComponent
  ){}

  /* GESTION DE LA MODAL PLATEFORM */
  setModal(platform: PlateformInterface | undefined){
    this.app.platformSelected = platform;
  }
  selectViewMyPlatform(hmp: HistoryMyPlatformInterface) {
    this.app.viewMyPlatform = hmp;
  }

}
