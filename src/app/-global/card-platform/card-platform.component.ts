import { Component, Input } from '@angular/core';
import { PlateformInterface } from 'src/app/-interface/plateform.interface';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-card-platform',
  templateUrl: './card-platform.component.html',
  styleUrls: ['./card-platform.component.css']
})
export class CardPlatformComponent {


  @Input()
  public platform: PlateformInterface|null = null;

  constructor(
    protected app:AppComponent
  ){}
  
}
