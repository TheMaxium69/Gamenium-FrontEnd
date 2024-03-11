import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserInterface} from "../../-interface/user.interface";
import {AppComponent} from "../../app.component";
import {ProfilInterface} from "../../-interface/profil.interface";
import {ProfilService} from "../../-service/profil.service";
import {BadgeService} from "../../-service/badge.service";
import {BadgeInterface} from "../../-interface/badge.interface";

@Component({
  selector: 'app-head-profile',
  templateUrl: './head-profile.component.html',
  styleUrls: ['./head-profile.component.css']
})
export class HeadProfileComponent implements OnInit{

  profileId: number|any;
  userConnected: UserInterface | undefined;
  profilSelected: ProfilInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;

  constructor(private route: ActivatedRoute,
              private app:AppComponent,
              private profileService:ProfilService,
              private badgeService: BadgeService) { }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');

    if (!this.profileId){
      this.userConnected = this.app.userConnected;
      this.profileId = this.userConnected?.id
    }

    this.getInfoProfile(this.profileId);
    this.getBadgeByUser(this.profileId);

  }

  getInfoProfile(id:number){

      this.profileService.getProfilByUserId(id,this.app.setURL()).subscribe(responseProfil => {

        console.log(responseProfil);

        if (responseProfil.message == "good"){

          this.profilSelected = responseProfil.result;

          console.log(this.profilSelected)

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

}
