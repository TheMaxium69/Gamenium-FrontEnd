import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {PlateformInterface} from "../../-interface/plateform.interface";
import {AppComponent} from "../../app.component";
import {ActivatedRoute} from "@angular/router";
import {PlateformService} from "../../-service/plateform.service";

@Component({
  selector: 'app-tab-mygame',
  templateUrl: './tab-mygame.component.html',
  styleUrls: ['./tab-mygame.component.css']
})
export class TabMygameComponent implements OnInit, OnChanges {

  userConnected: UserInterface | undefined;
  plateformeId: number | any;
  task:any;
  isColor: string = this.app.colorDefault;
  plateformsUser: PlateformInterface[] | undefined;

  constructor(private app:AppComponent,
              private route: ActivatedRoute,
              private plateformService: PlateformService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newTask = params.get('task');
      if (newTask !== this.plateformeId) {
        this.plateformeId = newTask;
        this.task = this.plateformeId;
        this.load();
        if (this.task == 'recent'){
          console.log("RECENT")
        }
      }
    });

  }

  load(){
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.isColor = this.userConnected.themeColor;
      this.myPlateforme(this.userConnected.id);
    }
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['task']) {
      this.load()
    }
  }

  /* OBTENIR TOUTE LES CONSOLE */
  myPlateforme(id:number){
    this.plateformService.getPlateformWithUser(id, this.app.setURL()).subscribe((reponsePlateformUser: {message:string, result:PlateformInterface[]}) => {
      if (reponsePlateformUser.message == "good") {
        this.plateformsUser = reponsePlateformUser.result;
      }
    })
  }

}