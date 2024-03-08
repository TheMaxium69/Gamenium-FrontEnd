import { Component, Inject, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserInterface } from '../../-interface/user.interface';
import { BadgeService } from '../../-service/badge.service';
import { BadgeInterface } from '../../-interface/badge.interface';
import { UserService } from '../../-service/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { UploadService } from '../../-service/upload.service';

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

  constructor(
    private app: AppComponent,
    private badgeService: BadgeService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    @Inject(UploadService) private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.userConnected = this.app.userConnected;
    if (this.userConnected) {
      this.getBadgeByUser(this.userConnected.id);
      this.profileImage = this.userConnected?.pp_id;
      this.loadThemeColor();
    }
  }

  loadThemeColor() {
    const userId = this.userConnected?.id;
    if (userId) {
      this.userService.getThemeColor(userId).subscribe((themeColor) => {
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

  onSubmit() {
    const file = this.profilePictureInput.nativeElement.files[0];
    if (file) {
      this.profileImage.uploadProfilePicture(this.userConnected?.id, file)
        .subscribe((response: any) => {
          console.log('Téléchargement réussi !', response);
  
          this.profileImage = response.imageUrl; 
  
        }, (error: any) => {
          console.error('Échec du téléchargement :', error);
  
          
          this.errorMessage = 'Une erreur est survenue lors du téléchargement'; 
        });
    } else {
      console.error('Aucun fichier sélectionné');
    }
  }
  
    

  saveColor(): void {
    if (this.tempColor && this.userConnected) {
      this.selectedColor = this.tempColor;
      this.userConnected.themeColor = this.tempColor;

      this.userService.updateThemeColor(this.userConnected.id, this.tempColor).subscribe((response) => {
        console.log('Couleur du thème mise à jour avec succès', response);
      });
    }
  }
}
