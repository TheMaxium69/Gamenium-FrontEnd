import { Component, Inject, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserInterface } from '../../-interface/user.interface';
import { BadgeService } from '../../-service/badge.service';
import { BadgeInterface } from '../../-interface/badge.interface';
import { UserService } from '../../-service/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { UploadProfilePictureService } from '../../-service/upload.service';
import {PictureInterface} from "../../-interface/picture.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userConnected: UserInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;
  profileImage: String|undefined;

  selectedColor: string = '';
  tempColor: string = '';

  selectedFile: File | undefined;

  constructor(
    private app: AppComponent,
    private badgeService: BadgeService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private uploadService: UploadProfilePictureService
  ) {}

  ngOnInit() {
    this.userConnected = this.app.userConnected;
    if (this.userConnected) {
      this.getBadgeByUser(this.userConnected.id);

      this.profileImage = this.userConnected?.pp?.url;


      this.loadThemeColor();
    }
  }

  loadThemeColor() {
    const userId = this.userConnected?.id;
    if (userId) {
      this.userService.getThemeColor(userId, this.app.setURL()).subscribe((themeColor) => {
        if (this.userConnected) {
          this.userConnected.themeColor = themeColor;
          this.cdRef.detectChanges();
        }
      });
    }
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

  saveColor(): void {
    if (this.tempColor && this.userConnected) {
      this.selectedColor = this.tempColor;
      this.userConnected.themeColor = this.tempColor;

      this.userService.updateThemeColor(this.userConnected.id, this.tempColor, this.app.setURL()).subscribe((response) => {
        console.log('Couleur du thème mise à jour avec succès', response);
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








}
