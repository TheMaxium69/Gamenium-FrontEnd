import {Component, OnInit} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {ProfilInterface} from "../../-interface/profil.interface";
import {BadgeInterface} from "../../-interface/badge.interface";
import {ActivatedRoute} from "@angular/router";
import {AppComponent} from "../../app.component";
import {ProfilService} from "../../-service/profil.service";
import {BadgeService} from "../../-service/badge.service";

@Component({
  selector: 'app-home-connected',
  templateUrl: './home-connected.component.html',
  styleUrls: ['./home-connected.component.css']
})
export class HomeConnectedComponent implements OnInit {

  profileId: number|any;
  userConnected: UserInterface | undefined;
  profilSelected: ProfilInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;
  isYourProfil:boolean = false;

  isColor:string = this.app.colorDefault;

  constructor(private route: ActivatedRoute,
              private app:AppComponent,
              private profileService:ProfilService,
              private badgeService: BadgeService) { }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');
    this.userConnected = this.app.userConnected;

    if (!this.profileId){
      this.profileId = this.userConnected?.id
    } else if (this.profileId == this.userConnected?.id){
      this.isYourProfil = true
    }


    this.getInfoProfile(this.profileId);
    this.getBadgeByUser(this.profileId);



  }

  getInfoProfile(id:number){

    this.profileService.getProfilByUserId(id,this.app.setURL()).subscribe(responseProfil => {

      if (responseProfil.message == "good"){

        this.profilSelected = responseProfil.result;

        if (this.profilSelected?.themeColor){
          this.isColor = this.profilSelected.themeColor;
        }

        // if (this.profilSelected?.picture){
        //   this.isPp = this.profilSelected.picture.url;
        // }

      } else {

        console.log("err user not existing");

      }

    });

  }

  getBadgeByUser(id: number): void {
    this.badgeService.getBadgeByUser(id, this.app.setURL()).subscribe((ReponseApi) => {
      if (ReponseApi.message == 'good') {
        this.badgeUserConnected = ReponseApi.result;
      }
    });
  }

  extractFirstLetter(str: string|any): string {
    return str.charAt(0);
  }

}
