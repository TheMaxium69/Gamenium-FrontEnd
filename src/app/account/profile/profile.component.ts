import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserInterface } from '../../-interface/user.interface';
import { BadgeService } from '../../-service/badge.service';
import { BadgeInterface } from '../../-interface/badge.interface';
import { UserService } from '../../-service/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { UploadService } from '../../-service/upload.service';
import {PictureInterface} from "../../-interface/picture.interface";
import { SocialNetworkService } from 'src/app/-service/social-network.service';
import { SocialNetworkInterface } from 'src/app/-interface/social-network.interface';
import { NgForm } from '@angular/forms';
import {ProfilService} from "../../-service/profil.service";
import {ProfilInterface} from "../../-interface/profil.interface";
import Swal from "sweetalert2";
import {ProfilSocialNetworkInterface} from "../../-interface/profil-social-network.interface";
import {ApicallInterface} from "../../-interface/apicall.interface";
import {DeviseService} from "../../-service/devise.service";
import {DeviseInterface} from "../../-interface/devise.interface";
import {UserdefaultService} from "../../-service/userdefault.service";
import {UserDefaultInterface} from "../../-interface/user-default.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  userConnected: UserInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;
  allBadges: BadgeInterface[] | undefined;
  profileImage: String|undefined;
  profilSelected: ProfilInterface | undefined;
  reseauSelected: ProfilSocialNetworkInterface[] | undefined;

  selectedColor: string = '';
  tempColor: string = '';

  color: string | undefined;
  oldColor:string = this.app.colorDefault;

  selectedFile: File | undefined;
  socialNetworkAll: SocialNetworkInterface[] | undefined;

  constructor(
    protected app: AppComponent,
    private badgeService: BadgeService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private uploadService: UploadService,
    private socialnetworkService: SocialNetworkService,
    private profileService: ProfilService,
    private renderer: Renderer2,
    private deviseService: DeviseService,
    private userDefaultService:UserdefaultService
  ) {}

  ngOnInit() {
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.getBadgeByUser(this.userConnected.id);

      // this.profileImage = this.userConnected?.pp?.url;

      this.getInfoProfile(this.userConnected.id)

      // this.loadThemeColor();
      // this.color = this.app.userConnected?.themeColor || this.app.colorDefault;

    }

    this.getAllSocialNetwork();

    this.getAllBadges();

    this.getAllDevise();

    this.getInfoDefault();
  }

  populateResultDiv() {
    const resultDiv = document.querySelector('#result') as HTMLElement
    const settings = document.querySelectorAll('.search-setting')


    settings.forEach((setting) => {
      if (setting instanceof HTMLElement) {
        resultDiv.appendChild(setting)
      }
    });
  }


  filterSettings(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    const search = inputValue.toLowerCase();
    const resultDiv = document.querySelector('#result') as HTMLElement;
    const accountSection = document.querySelector('.para-container') as HTMLElement;
    const infoSection = document.querySelector('.informations-section') as HTMLElement;
    const unlog = document.querySelector('.unlog') as HTMLElement;
    const settings = document.querySelectorAll('.search-setting')
    let settingsResultNumber = 0;

    this.populateResultDiv()
    resultDiv.style.display = 'block';

    settings.forEach((child) => {
      const setting = child as HTMLElement;
      const settingText = setting.firstChild?.textContent?.toLowerCase();

      if (search && settingText && !settingText.includes(search)) {
        setting.style.display = 'none';

      } else {
        setting.style.display = 'block';
        settingsResultNumber++;
      }
    });

    if (!search) {
      resultDiv.style.display = 'none';
      accountSection.style.display = 'block';
      infoSection.style.display = 'block';
      unlog.style.display = 'block';
      this.removeNoResultMessage(resultDiv);
      this.resetParaContainer()
      this.resetInfoContainer()

    } else {
      accountSection.style.display = 'none';
      infoSection.style.display = 'none';
      unlog.style.display = settingsResultNumber > 0 ? 'block' : 'none';
    }

    if (settingsResultNumber === 0) {
      this.displayNoResultMessage(resultDiv);

    } else {
      this.removeNoResultMessage(resultDiv);
    }
  }

  resetParaContainer() {
    console.log('reset para')
    const paraContainer = document.querySelector('.para-container') as HTMLElement
    const settings = document.querySelectorAll('.para-setting')
    const unlogBtn = document.querySelector('.unlog')

    settings.forEach(setting => {
      if (setting instanceof HTMLElement) {
        paraContainer.insertBefore(setting, unlogBtn)
      }
    });
  }

  resetInfoContainer() {
    console.log('reset info')
    const infoContainer = document.querySelector('.informations-section') as HTMLElement
    const settings = document.querySelectorAll('.information-setting')

    settings.forEach(setting => {
      if (setting instanceof HTMLElement) {
        infoContainer.appendChild(setting)
      }
    });
  }

  displayNoResultMessage(container: HTMLElement) {
    let noResult = document.querySelector('#no-results') as HTMLElement;

    if (!noResult) {
      noResult = document.createElement('div');
      this.renderer.setAttribute(noResult, 'id', 'no-results')
      this.renderer.addClass(noResult, 'no-result-message')
      this.renderer.setProperty(noResult, 'innerText', 'Pas de résultat pour la recherche')
      this.renderer.setStyle(noResult, 'fontSize', '18px')
      this.renderer.appendChild(container, noResult);
    }

    noResult.style.display = 'block';
  }

  removeNoResultMessage(container: HTMLElement) {
    const noResult = document.querySelector('#no-results');

    if (noResult) {
      noResult.remove();
    }
  }

  // loadThemeColor() {
  //   const userId = this.userConnected?.id;
  //   if (userId) {
  //     this.userService.getThemeColor(userId, this.app.setURL()).subscribe((themeColor) => {
  //       if (this.userConnected) {
  //         this.userConnected.themeColor = themeColor;
  //         if (this.userConnected.themeColor !== null && this.userConnected.themeColor[0] !== null){
  //           this.color = this.userConnected.themeColor;
  //           this.oldColor = this.userConnected.themeColor;
  //         } else {
  //           this.color = this.app.colorDefault;
  //           this.oldColor = this.app.colorDefault;
  //         }
  //         this.cdRef.detectChanges();
  //       }
  //     });
  //   }
  // }

  debug(){
    console.log(this.color)
  }

  getInfoProfile(id:number){

    this.profileService.getProfilByUserId(id,this.app.setURL(), this.app.createCorsToken()).subscribe(responseProfil => {

      if (responseProfil.message == "good"){

        this.profilSelected = responseProfil.result;

        if (this.profilSelected?.themeColor) {
          this.color = this.profilSelected.themeColor
        }

        this.profilSelected?.reseau.forEach(reseau => {
          this.reseauSelected = this.reseauSelected || [];
          this.reseauSelected[reseau.socialnetwork.id] = reseau;
        });

      } else {

        console.log("err user not existing");

      }

    });

  }

  loggout() {
    this.app.loggout();
  }

  getBadgeByUser(id: number | undefined): void {
    this.badgeService.getBadgeByUser(id, this.app.setURL(), this.app.createCorsToken()).subscribe((ReponseApi) => {
      if (ReponseApi.message == 'good') {
        this.badgeUserConnected = ReponseApi.result;
      }
    });
  }

  getAllBadges() {
    this.badgeService.getAllBadges(this.app.setURL(), this.app.createCorsToken()).subscribe((ReponseApi) => {
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
    if (this.color && this.userConnected) {
      // this.selectedColor = this.color;
      // this.userConnected.themeColor = this.color;

      this.userService.updateThemeColor(this.userConnected.id, this.color, this.app.setURL(), this.app.createCorsToken()).subscribe((response:ApicallInterface) => {
        if (this.userConnected && response.message == "Theme color updated successfully"){
          this.app.userConnected.themeColor = this.color;
          Swal.fire({
            title: 'Succès!',
            text: 'Votre thème à bien été mise à jour.',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.color
          })
        } else {
          this.selectedColor = this.oldColor;
          this.color = this.oldColor;
          Swal.fire({
            title: 'Échec!',
            text: 'Échec de la mise à jour du thème',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: this.oldColor
          })
        }
      }, (error) => {
        this.selectedColor = this.oldColor;
        this.color = this.oldColor;
        if (this.userConnected) {
          this.userConnected.themeColor = this.oldColor;
        }
        this.app.erreurSubcribe()  });
    }
  }

  onFileChanged(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0]

      // crée une preview de limage quand avant de l'upload
      const previewImage = URL.createObjectURL(this.selectedFile)

      const preview = document.querySelector('.profile-avatar') as HTMLElement
      if (preview) {
        preview.style.backgroundImage = `url(${previewImage})`
        preview.style.backgroundSize = 'cover'
        preview.style.backgroundPosition = 'center'
      }

      console.log(this.selectedFile);
      console.log(previewImage)
    }
  }

  onUpload() {

    if (!this.selectedFile) {
      console.log('Aucun fichier sélectionné');
      return;
    }

    const uploadButton = document.querySelector('#upload-button') as HTMLButtonElement
    uploadButton.disabled = true
    uploadButton.textContent = "Envoie du fichier en cours..."

    this.uploadService.uploadUserPhoto(this.selectedFile, this.app.setURL(), this.app.createCorsToken(true)).subscribe(responseUploadPhoto => {

      if (responseUploadPhoto.message == "good"){
        uploadButton.disabled = false
        uploadButton.textContent = "Télécharger"

        Swal.fire({
          title: 'Succès!',
          text: 'Votre photo de profil à bien été mise à jour.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      } else {
        uploadButton.disabled = false
        uploadButton.textContent = "Télécharger"

        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de la mise à jour de la photo de profil',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }

    }, (error) => this.app.erreurSubcribe());
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

    this.socialnetworkService.getAllSocialNetwork(this.app.setURL(), this.app.createCorsToken()).subscribe(responseSocialNetworkAll => {

      if(responseSocialNetworkAll.message == "good"){

        this.socialNetworkAll = responseSocialNetworkAll.result;
        console.log(this.socialNetworkAll);
      }

    });

  }

  extractFirstLetter(str: string|any): string {
    return str.charAt(0);
  }


  getAllDevise(){
    if (this.app.deviseNoReload.length === 0){
      this.deviseService.getAllDevise(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseDeviseAll:{message:string,result:DeviseInterface[]})=>{
        if (reponseDeviseAll.message == "good"){
          this.app.deviseNoReload = reponseDeviseAll.result;
        }
      })
    }
  }

  getInfoDefault(){
    if (!this.app.userDefaultNoReload){
      this.userDefaultService.getAllDefault(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseUserDefault:{message:string,result:UserDefaultInterface})=>{
        if (reponseUserDefault.message == "good"){
          this.app.userDefaultNoReload = reponseUserDefault.result;
        }
      })
    }
  }


  updateDefault(){


    let selectElement = document.getElementById('devise');
    let selectedValue: string | null = null;

    if (selectElement instanceof HTMLSelectElement) {
      selectedValue = selectElement.value;
    }

    if ("" == selectedValue?.trim()){
      return
    }

    let bodyNoJson = {
      "id_devise":selectedValue
    }

    let body = JSON.stringify(bodyNoJson);

    this.userDefaultService.updateUserDefault(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseUserDefault:{message:string,result:UserDefaultInterface}) => {
      if(reponseUserDefault.message == "good"){
        /* set variable */
        this.app.userDefaultNoReload = reponseUserDefault.result;

        let selectDevise = document.getElementById('devise');
        if (selectDevise instanceof HTMLSelectElement) {
          selectDevise.value = "";
        }

        Swal.fire({
          title: 'Succès!',
          text: 'Vos options ont bien été mise à jour',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      } else {
        Swal.fire({
          title: 'Echec!',
          text: 'Echec de la mise à jour des options',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }
    }, (error) => {
      this.app.erreurSubcribe();
    });



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

    // console.log(bodyJson);

      this.socialnetworkService.postSocialNetworkByUser(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(response => {
        if (response.message == "succefuly created"){
          Swal.fire({
            title: 'Succès!',
            text: 'Vos réseaux ont bien été mise à jour',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
          })
        } else if (response.message == "succefuly updated"){
          Swal.fire({
            title: 'Succès!',
            text: 'Vos réseaux ont bien été mise à jour',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
          })
        } else {
          Swal.fire({
            title: 'Echec!',
            text: 'Echec de la mise à jour des réseaux',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
          })
        }

      }, (error) => { this.app.erreurSubcribe() });

  }

  deletePicture() {
    this.userService.deleleProfilPicture(this.app.setURL(), this.app.createCorsToken()).subscribe(ReponseApi => {
      if (ReponseApi.message == 'photo supprimée') {
        Swal.fire({
          title: 'Succès!',
          text: 'Votre photo de profil à bien été supprimé.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      } else {
        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de la mise à jour de la photo de profil',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }
    }, (error) => this.app.erreurSubcribe())
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

