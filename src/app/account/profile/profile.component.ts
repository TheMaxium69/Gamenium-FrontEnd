import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { UserInterface } from '../../-interface/user.interface';
import { BadgeService } from '../../-service/badge.service';
import { BadgeInterface } from '../../-interface/badge.interface';
import { UserService } from '../../-service/user.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userConnected: UserInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;
  profileImage: any;
  selectedColor: string = '';
  tempColor: string = '';


  constructor(
    private app: AppComponent,
    private badgeService: BadgeService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userConnected = this.app.userConnected;
    this.getBadgeByUser(this.userConnected?.id);
    this.profileImage = this.userConnected?.pp_id;
    this.loadThemeColor();
  }


  loadThemeColor() {
    const userId = this.userConnected?.id;
    if (userId) {
      this.userService.getThemeColor(userId).subscribe((themeColor) => {
        if (this.userConnected) {
          console.log('Couleur du thème récupérée avec succès', this.userConnected);
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.profileImage = reader.result;
      this.userConnected!.pp_id = this.profileImage;
    };
  }

  saveColor(): void {
    if (this.tempColor && this.userConnected) {
      this.selectedColor = this.tempColor;
      this.userConnected.themeColor = this.tempColor;

      this.userService.updateThemeColor(this.userConnected.id, this.tempColor).subscribe((response) => {
        console.log('Couleur du thème mise à jour avec succès', response);

      });
      console.log(this.userConnected.themeColor);
    }
  }
}
