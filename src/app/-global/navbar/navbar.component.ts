import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import { ProfilService } from 'src/app/-service/profil.service';
import { ProfilInterface } from 'src/app/-interface/profil.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn:boolean|undefined;
  buttonColor: string = "red";
  profilSelected: ProfilInterface | undefined;
  

  constructor( private app: AppComponent, private profileService: ProfilService ) { }

  ngOnInit() {

    this.isLoggedIn = this.app.isLoggedIn;
    if (this.isLoggedIn) {   
      this.updateConnect();
    }

  }

  updateConnect(): void {
    const userId = this.app.userConnected?.id;
    if (userId) {
      this.profileService.getProfilByUserId(userId, this.app.setURL()).subscribe(responseProfil => {
        if (responseProfil.message === "good") {
          this.profilSelected = responseProfil.result;
          if (this.profilSelected?.themeColor) {
            this.buttonColor = this.profilSelected.themeColor; 
          }
        } else {
          console.error("Error: User profile not found");
        }
      });
    }
  }



}
