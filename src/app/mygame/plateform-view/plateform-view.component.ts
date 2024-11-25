import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ActivatedRoute} from "@angular/router";
import {UserInterface} from "../../-interface/user.interface";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {HistoryMyGameService} from "../../-service/history-my-game.service";

@Component({
  selector: 'app-plateform-view',
  templateUrl: './plateform-view.component.html',
  styleUrls: ['./plateform-view.component.css']
})
export class PlateformViewComponent implements OnInit {

  userConnected: UserInterface | undefined;
  plateformeId_GB: number | any;
  HistoireMyGameByUserByPlateform: HistoryMyGameInterface[] | undefined;

  constructor(private app:AppComponent,
              private route: ActivatedRoute,
              private histoireMyGameService: HistoryMyGameService) {}

  ngOnInit(): void {

    this.plateformeId_GB = this.route.snapshot.paramMap.get('task');
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.myGameByUserWithPlateform(this.userConnected.id, this.plateformeId_GB);
    }

  }

  myGameByUserWithPlateform(id_user: number, id_plateform_gb:number) {
    this.histoireMyGameService.getMyGameByUserWithPlateform(id_user,id_plateform_gb, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.HistoireMyGameByUserByPlateform = responseMyGame.result;
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
    });
  }

}
