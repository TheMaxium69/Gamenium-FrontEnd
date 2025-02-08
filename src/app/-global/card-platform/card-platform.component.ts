import { Component, Input } from '@angular/core';
import { PlateformInterface } from 'src/app/-interface/plateform.interface';
import { AppComponent } from 'src/app/app.component';
import {HistoryMyPlatformInterface} from "../../-interface/history-my-platform.interface";

@Component({
  selector: 'app-card-platform',
  templateUrl: './card-platform.component.html',
  styleUrls: ['./card-platform.component.css']
})
export class CardPlatformComponent {


  @Input()
  public platform: PlateformInterface|undefined;

  @Input()
  public hmp: HistoryMyPlatformInterface | undefined;

  @Input()
  public state: string | null = null;


  constructor(
    protected app:AppComponent
  ){}

  /* GESTION DE LA MODAL PLATEFORM */
  setModal(platform: PlateformInterface | undefined){
    this.app.platformSelected = platform;
  }

}
