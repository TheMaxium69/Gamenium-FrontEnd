import {Component, OnInit} from '@angular/core';
import {PlateformInterface} from "../../-interface/plateform.interface";
import {PlateformService} from "../../-service/plateform.service";
import {AppComponent} from "../../app.component";
import {UserInterface} from "../../-interface/user.interface";

@Component({
  selector: 'app-recent-view',
  templateUrl: './recent-view.component.html',
  styleUrls: ['./recent-view.component.css']
})
export class RecentViewComponent implements OnInit {

  constructor(private plateformService: PlateformService,
              private app:AppComponent) {}

  plateformsUser: PlateformInterface[] | undefined;
  userConnected: UserInterface | undefined;
  isColor: string = this.app.colorDefault;

  ngOnInit(){
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.isColor = this.userConnected.themeColor;
      this.myPlateforme(this.userConnected.id)
    }

  }

  myPlateforme(id:number){
    this.plateformService.getPlateformWithUser(id, this.app.setURL()).subscribe((reponsePlateformUser: {message:string, result:PlateformInterface[]}) => {
      if (reponsePlateformUser.message == "good") {
        this.plateformsUser = reponsePlateformUser.result;
      }
    })
  }

}
