import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserInterface} from "../../-interface/user.interface";
import {AppComponent} from "../../app.component";
import {ProfilInterface} from "../../-interface/profil.interface";
import {ProfilService} from "../../-service/profil.service";

@Component({
  selector: 'app-head-profile',
  templateUrl: './head-profile.component.html',
  styleUrls: ['./head-profile.component.css']
})
export class HeadProfileComponent implements OnInit{

  profileId: number|any;
  userConnected: UserInterface | undefined;
  profilSelected: ProfilInterface | undefined;

  constructor(private route: ActivatedRoute,
              private app:AppComponent,
              private profileService:ProfilService) { }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');

    if (!this.profileId){
      this.userConnected = this.app.userConnected;
      this.profileId = this.userConnected?.id
    }

    this.getInfoProfile(this.profileId);

  }

  getInfoProfile(id:number){

      this.profileService.getProfilByUserId(id,this.app.setURL()).subscribe(responseProfil => {

        if (responseProfil.message == "good"){

          this.profilSelected = responseProfil.result;

          console.log(this.profilSelected)

        } else {

          console.log("err user not existing");

        }

      });

  }

}
