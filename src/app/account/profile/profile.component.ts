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
  profileImage: any;

  constructor(private app: AppComponent, private badgeService: BadgeService) { }


  ngOnInit() {

    this.userConnected = this.app.userConnected;

    this.getBadgeByUser(this.userConnected?.id)

    this.profileImage = this.userConnected?.pp_id;
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
 // Méthode appelée lorsqu'un fichier est sélectionné
 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);


  reader.onload = () => {
    
    this.profileImage = reader.result;

    this.userConnected!.pp_id = this.profileImage;
  };
}
}
