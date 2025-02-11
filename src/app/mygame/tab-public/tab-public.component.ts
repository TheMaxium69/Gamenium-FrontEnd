import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {PlateformInterface} from "../../-interface/plateform.interface";
import {AppComponent} from "../../app.component";
import {ActivatedRoute} from "@angular/router";
import {PlateformService} from "../../-service/plateform.service";
import {ProfilInterface} from "../../-interface/profil.interface";
import {ProfilService} from "../../-service/profil.service";
import { HistoryMyGameInterface } from 'src/app/-interface/history-my-game.interface';

@Component({
  selector: 'app-tab-public',
  templateUrl: './tab-public.component.html',
  styleUrls: ['./tab-public.component.css']
})
export class TabPublicComponent implements OnInit, OnChanges {
  @Input() commonGame: HistoryMyGameInterface[] | any ;

  profileId: number|any;
  profilSelected: ProfilInterface | undefined;
  plateformeId: number | any;
  task:any;
  isColor: string = this.app.colorDefault;
  plateformsUser: PlateformInterface[] | undefined;

  constructor(protected app:AppComponent,
              private route: ActivatedRoute,
              private plateformService: PlateformService,
              private profileService: ProfilService) {}

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');

    this.route.paramMap.subscribe(params => {
      const newTask = params.get('task');
      if (newTask !== this.plateformeId) {
        this.plateformeId = newTask;
        this.task = this.plateformeId;
        this.loadProfil();
      }
    });

  }

  loadProfil(){
    this.getInfoProfile(this.profileId);
  }

  load(){
    if (this.profilSelected) {
      // Set la color
      if (this.profilSelected.themeColor){
        this.isColor = this.profilSelected.themeColor;
      }
      this.myPlateforme(this.profilSelected.id);

    }
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['task']) {
      this.load()
    }
  }

  commonGameAvailable(): boolean {
    return !!this.commonGame && this.commonGame.length > 0;
  }

  /* OBTENIR TOUTE LES CONSOLE */
  myPlateforme(id:number){
    this.plateformService.getPlateformWithUser(id, this.app.setURL(), this.app.createCorsToken()).subscribe((reponsePlateformUser: {message:string, result:PlateformInterface[]}) => {
      if (reponsePlateformUser.message == "good") {
        this.plateformsUser = reponsePlateformUser.result;
      }
    })
  }

  getInfoProfile(id:number){

    this.profileService.getProfilByUserId(id,this.app.setURL(), this.app.createCorsToken()).subscribe(responseProfil => {

      if (responseProfil.message == "good"){

        this.profilSelected = responseProfil.result;

        this.load();

      } else {

        // console.log("err user not existing");

      }

    });

  }

}
