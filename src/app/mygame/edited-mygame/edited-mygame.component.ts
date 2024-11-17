import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {ActivatedRoute} from "@angular/router";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";

@Component({
  selector: 'app-edited-mygame',
  templateUrl: './edited-mygame.component.html',
  styleUrls: ['./edited-mygame.component.css']
})
export class EditedMygameComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    protected app: AppComponent,
    protected historyMyGameService:HistoryMyGameService,
  ) {}

  idOneMyGame:number|any;
  selectedMyGame:HistoryMyGameInterface|undefined;

  ngOnInit() {

    this.idOneMyGame = this.route.snapshot.paramMap.get('editid');

    if (this.idOneMyGame) {
      this.getMyGame(this.idOneMyGame);
    }
  }

  getMyGame(idEditedMyGame: number){

    this.historyMyGameService.getOneMyGame(idEditedMyGame, this.app.setURL()).subscribe((reponseMyGame: { message: string; result: HistoryMyGameInterface | undefined; }) => {

      if (reponseMyGame.message == "good") {
        this.selectedMyGame = reponseMyGame.result;
      } else {
        console.log("pas de mygame")
      }

    })

  }




}
