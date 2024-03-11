import { Component, Inject, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserInterface } from '../../-interface/user.interface';
import { BadgeService } from '../../-service/badge.service';
import { BadgeInterface } from '../../-interface/badge.interface';
import { UserService } from '../../-service/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { UploadProfilePictureService } from '../../-service/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userConnected: UserInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;
  profileImage: any;
  selectedColor: string = '';
  tempColor: string = '';
  profilePictureInput: any;
  errorMessage: string | undefined;
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
      this.profileImage = this.userConnected?.pp_id;
      this.loadThemeColor();
      this.loadProfilePicture();
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

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }
  loadProfilePicture() {
    if (this.userConnected) {
      this.profileImage = this.userConnected.pp_id;
    }
  }


  onUpload() {
    if (!this.selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    this.uploadService.uploadProfilePicture(this.userConnected?.id || 0, this.selectedFile).subscribe(
      response => {
        console.log(response.message);
        // Rafraîchir l'image du profil après le téléchargement réussi
        this.loadProfilePicture();
      },
      error => {
        console.error('Erreur lors du téléchargement de l\'image : ', error);
      }
    );
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
}
