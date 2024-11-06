import { Component, Inject, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserInterface } from '../../-interface/user.interface';
import { BadgeService } from '../../-service/badge.service';
import { BadgeInterface } from '../../-interface/badge.interface';
import { UserService } from '../../-service/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { UploadProfilePictureService } from '../../-service/upload.service';
import {PictureInterface} from "../../-interface/picture.interface";
import { SocialNetworkService } from 'src/app/-service/social-network.service';
import { SocialNetworkInterface } from 'src/app/-interface/social-network.interface';
import { NgForm } from '@angular/forms';
import {ProfilService} from "../../-service/profil.service";
import {ProfilInterface} from "../../-interface/profil.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userConnected: UserInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;
  allBadges: BadgeInterface[] | undefined;
  profileImage: String|undefined;
  profilSelected: ProfilInterface | undefined;

  selectedColor: string = '';
  tempColor: string = '';

  color: string | [] = "red";

  selectedFile: File | undefined;
  socialNetworkAll: SocialNetworkInterface[] | undefined;

  constructor(
    private app: AppComponent,
    private badgeService: BadgeService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private uploadService: UploadProfilePictureService,
    private socialnetworkService: SocialNetworkService,
    private profileService: ProfilService
  ) {}

  ngOnInit() {
    this.userConnected = this.app.userConnected;
    console.log(this.userConnected)
    if (this.userConnected) {
      this.getBadgeByUser(this.userConnected.id);

      // this.profileImage = this.userConnected?.pp?.url;

      this.getInfoProfile(this.userConnected.id)

      this.loadThemeColor();
    }
    
    this.getAllSocialNetwork();
    
    this.getAllBadges();
  }

  loadThemeColor() {
    const userId = this.userConnected?.id;
    if (userId) {
      this.userService.getThemeColor(userId, this.app.setURL()).subscribe((themeColor) => {
        if (this.userConnected) {
          this.userConnected.themeColor = themeColor;
          this.color = this.userConnected.themeColor;
          this.cdRef.detectChanges();
        }
      });
    }
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

  loggout() {
    this.app.loggout();
  }

  getBadgeByUser(id: number | undefined): void {
    this.badgeService.getBadgeByUser(id, this.app.setURL()).subscribe((ReponseApi) => {
      if (ReponseApi.message == 'good') {
        this.badgeUserConnected = ReponseApi.result;
      }
    });
  }

  getAllBadges() {
    this.badgeService.getAllBadges(this.app.setURL()).subscribe((ReponseApi) => {
      if (ReponseApi.message == 'good') {
        this.allBadges = ReponseApi.result;
        console.log(this.allBadges);
      }
    });
  }

  isBadgeInUserConnected(badge: any): boolean {
    if (this.badgeUserConnected) {
      return this.badgeUserConnected.some(userBadge => userBadge.id === badge.id)
    } else {
      return false
    }
  }

  saveColor(): void {
    if (this.tempColor && this.userConnected) {
      this.selectedColor = this.tempColor;
      this.userConnected.themeColor = this.tempColor;

      this.userService.updateThemeColor(this.userConnected.id, this.tempColor, this.app.setURL()).subscribe((response) => {
        console.log('Couleur du thème mise à jour avec succès', response);
        if (this.userConnected){
          this.color = this.userConnected.themeColor;
        }
      });
    }
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile)
  }

  onUpload() {

    if (!this.selectedFile) {
      console.log('Aucun fichier sélectionné');
      return;
    }

    this.uploadService.uploadUserPhoto(this.selectedFile, this.app.setURL(), this.app.createCorsToken(true)).subscribe(responseUploadPhoto => {


      console.log(responseUploadPhoto);


    });
  }

  // onFileChanged(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }
  // loadProfilePicture() {
  //   if (this.userConnected) {
  //     this.profileImage = this.userConnected.pp;
  //   }
  // }
  //
  //

  getAllSocialNetwork(){

    this.socialnetworkService.getAllSocialNetwork(this.app.setURL()).subscribe(responseSocialNetworkAll => {

      if(responseSocialNetworkAll.message == "good"){

        this.socialNetworkAll = responseSocialNetworkAll.result;
        console.log(this.socialNetworkAll);
      }

    });

  }

  extractFirstLetter(str: string|any): string {
    return str.charAt(0);
  }

  addUrlSocial(form: NgForm){

    let resultForm: any = form.value;
    let bodyNoJson: any[] = [];

    this.socialNetworkAll?.forEach(socialNetworkOne =>{

      if(resultForm[socialNetworkOne.name]){

        bodyNoJson.push({
            "id_socialnetwork":socialNetworkOne.id,
            "url":resultForm[socialNetworkOne.name],
          });

      }

    });

    let bodyJson = JSON.stringify(bodyNoJson);

    console.log(bodyJson);

      this.socialnetworkService.postSocialNetworkByUser(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(response => {
        console.log(response);
      });

  }


  protected readonly ProfilService = ProfilService;
}


  /*

    <!-- Facebook -->

    <i class="ri-facebook-circle-fill"></i>
    <label for="lien_compte">Votre lien Facebook : </label><br>
    <input type="text" id="facebook" name="facebook"><br><br>

    <!-- Instagram -->

    <i class="ri-instagram-fill"></i>
    <label for="lien_compte">Votre lien Instagram : </label><br>
    <input type="text" id="instagram" name="instagram"><br><br>

    <!-- Github -->

    <i class="ri-github-fill"></i>
    <label for="lien_compte">Votre lien Github : </label><br>
    <input type="text" id="github" name="github"><br><br>

    <!-- Linkedin -->

    <i class="ri-linkedin-box-fill"></i>
    <label for="lien_compte">Votre lien Linkedin : </label><br>
    <input type="text" id="linkedin" name="linkedin"><br><br>

    <!-- Playstation -->

    <i class="ri-playstation-fill"></i>
    <label for="lien_compte">Votre lien Playstation : </label><br>
    <input type="text" id="playstation" name="playstation"><br><br>

    <!-- Steam -->

    <i class="ri-steam-fill"></i>
    <label for="lien_compte">Votre lien Steam : </label><br>
    <input type="text" id="steam" name="steam"><br><br>

    <!-- X -->

    <i class="ri-twitter-x-fill"></i>
    <label for="lien_compte">Votre lien X : </label><br>
    <input type="text" id="x" name="x"><br><br>

    <!-- Tiktok -->

    <i class="ri-tiktok-fill"></i>
    <label for="lien_compte">Votre lien Tiktok : </label><br>
    <input type="text" id="tiktok" name="tiktok"><br><br>

    <!-- Xbox -->

    <i class="ri-xbox-fill"></i>
    <label for="lien_compte">Votre lien Xbox : </label><br>
    <input type="text" id="xbox" name="xbox"><br><br>

    <!-- Youtube -->

    <i class="ri-youtube-fill"></i>
    <label for="lien_compte">Votre lien Youtube : </label><br>
    <input type="text" id="youtube" name="youtube"><br><br>

    <!-- Twitch -->

    <i class="ri-twitch-fill"></i>
    <label for="lien_compte">Votre lien Twitch : </label><br>
    <input type="text" id="twitch" name="twitch"><br><br>

    <!-- Switch -->

    <i class="ri-switch-fill"></i>
    <label for="lien_compte">Votre lien Switch : </label><br>
    <input type="text" id="switch" name="switch"><br><br>

    <!-- Reddit -->

    <i class="ri-reddit-fill"></i>
    <label for="lien_compte">Votre lien Reddit : </label><br>
    <input type="text" id="reddit" name="reddit"><br><br>

    <!-- Slack -->

    <i class="ri-slack-fill"></i>
    <label for="lien_compte">Votre lien Slack : </label><br>
    <input type="text" id="slack" name="slack"><br><br>

    <!-- Snapchat -->

    <i class="ri-snapchat-fill"></i>
    <label for="lien_compte">Votre lien Snapchat : </label><br>
    <input type="text" id="snapchat" name="snapchat"><br><br>

    <!-- Skype -->

    <i class="ri-skype-fill"></i>
    <label for="lien_compte">Votre lien Skype : </label><br>
    <input type="text" id="skype" name="skype"><br><br>

    <!-- Spotify -->

    <i class="ri-spotify-line"></i>
    <label for="lien_compte">Votre lien Spotify : </label><br>
    <input type="text" id="spotify" name="spotify"><br><br>

    <!-- Soundcloud -->

    <i class="ri-soundcloud-fill"></i>
    <label for="lien_compte">Votre lien Soundcloud : </label><br>
    <input type="text" id="soundcloud" name="soundcloud"><br><br>

    <!-- Notion -->

    <i class="ri-notion-fill"></i>
    <label for="lien_compte">Votre lien Notion : </label><br>
    <input type="text" id="notion" name="notion"><br><br>

    <!-- Microsoft -->

    <i class="ri-Microsoft-fill"></i>
    <label for="lien_compte">Votre lien Microsoft : </label><br>
    <input type="text" id="microsoft" name="microsoft"><br><br>

    <!-- Kick -->

    <i class="ri-kick-fill"></i>
    <label for="lien_compte">Votre lien Kick : </label><br>
    <input type="text" id="kick" name="kick"><br><br>

    <!-- Meta -->

    <i class="ri-meta-fill"></i>
    <label for="lien_compte">Votre lien Meta : </label><br>
    <input type="text" id="meta" name="meta"><br><br>

    <!-- Google -->

    <i class="ri-google-fill"></i>
    <label for="lien_compte">Votre lien Google : </label><br>
    <input type="text" id="google" name="google"><br><br>

    <!-- Discord -->

    <i class="ri-discord-fill"></i>
    <label for="lien_compte">Votre lien Discord : </label><br>
    <input type="text" id="discord" name="discord"><br><br>

  */

