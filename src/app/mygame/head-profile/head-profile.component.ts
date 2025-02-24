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
  isYourProfil:boolean = false;
  nbGame: number = 0;
  nbNote: number = 0;

  isColor:string = this.app.colorDefault;
  // isPp:string|undefined;

  constructor(private route: ActivatedRoute,
              protected app:AppComponent,
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

      this.profileService.getProfilByUserId(id,this.app.setURL(), this.app.createCorsToken()).subscribe(responseProfil => {

        if (responseProfil.message == "good"){

          this.profilSelected = responseProfil.result;

          if (this.profilSelected?.themeColor){
            this.isColor = this.profilSelected.themeColor;
            if (typeof this.profilSelected.nbGame == 'number' && typeof this.profilSelected.nbNote == 'number') {
              this.nbGame = this.profilSelected.nbGame;
              this.nbNote = this.profilSelected.nbNote;
            }
          }

          // if (this.profilSelected?.picture){
          //   this.isPp = this.profilSelected.picture.url;
          // }

        } else {

          // console.log("err user not existing");

        }

      });

  }

  getBadgeByUser(id: number): void {
    this.badgeService.getBadgeByUser(id, this.app.setURL(), this.app.createCorsToken()).subscribe((ReponseApi) => {
      if (ReponseApi.message == 'good') {
        this.badgeUserConnected = ReponseApi.result;
      }
    });
  }

  extractFirstLetter(str: string|any): string {
    return str.charAt(0);
  }

}
