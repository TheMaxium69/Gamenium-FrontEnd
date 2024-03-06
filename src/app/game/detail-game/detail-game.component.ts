import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../-service/game.service";
import {AppComponent} from "../../app.component";
import {GameInterface} from "../../-interface/game.interface";

@Component({
  selector: 'app-detail-game',
  templateUrl: './detail-game.component.html',
  styleUrls: ['./detail-game.component.css']
})
export class DetailGameComponent implements OnInit{

  gameId: number|any;
  gameSelected: GameInterface|undefined;
  noneGame: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private app: AppComponent) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');

    this.getGameById(this.gameId)

  }

  getGameById(id:number){

    this.gameService.getGameById(id, this.app.setURL()).subscribe((reponseGameOne) => {

      if (reponseGameOne.message == "good"){

        this.gameSelected = reponseGameOne.result


      } else {

        this.noneGame = true;

      }


    });
  }
}
