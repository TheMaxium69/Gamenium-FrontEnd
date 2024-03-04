import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {UserInterface} from "../../-interface/user.interface";
import {BadgeService} from "../../-service/badge.service";
import {BadgeInterface} from "../../-interface/badge.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  userConnected:UserInterface|undefined;
  badgeUserConnected:BadgeInterface[]|undefined;

  constructor(private app: AppComponent, private badgeService: BadgeService) { }


  ngOnInit() {

    this.userConnected = this.app.userConnected;

    this.getBadgeByUser(this.userConnected?.id)
  }

  loggout(){
    this.app.loggout();
  }

  getBadgeByUser(id: number|undefined): void {

    this.badgeService.getBadgeByUser(id, this.app.setURL()).subscribe((ReponseApi) => {

      if (ReponseApi.message == "good"){

        this.badgeUserConnected = ReponseApi.result;

      }

    });

  }

}
