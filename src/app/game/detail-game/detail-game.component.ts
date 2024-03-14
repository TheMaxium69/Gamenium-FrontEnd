import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../-service/game.service";
import {AppComponent} from "../../app.component";
import {GameInterface} from "../../-interface/game.interface";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {NgForm} from "@angular/forms";

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
    private app: AppComponent,
    private histoireMyGameService: HistoryMyGameService) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');

    this.getGameById(this.gameId)

    this.app.getYourIp();
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

  addGame(form:NgForm) {

    let is_pinned = form.value['pinnedGame'];
    if (is_pinned == ""){
      is_pinned = false;
    }

    let bodyNoJsonMyGame: any = {
          "id_game":this.gameSelected?.id,
          "is_pinned":is_pinned,
    };


    const bodyMyGame = JSON.stringify(bodyNoJsonMyGame);

    this.histoireMyGameService.postMyGame(bodyMyGame, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyGameAdd => {

      if(reponseMyGameAdd.message == "add game is collection"){
        console.log(this.gameSelected?.name, " à été ajouter");
      } else {
        console.log("erreur message");
      }

    })

  }

  addNote(form:NgForm) {

    console.log(form.value);

    if (form.value['noteGame'] >= 0 && form.value['noteGame'] <= 20){

      let noteGame = form.value['noteGame'];

      let bodyNoJsonMyGameNote: any = {
        "id_game":this.gameSelected?.id,
        "note":noteGame,
      };

      const bodyMyGameNote = JSON.stringify(bodyNoJsonMyGameNote);

      this.histoireMyGameService.postNoteMyGame(bodyMyGameNote, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyGameNoteAdd => {

        console.log(reponseMyGameNoteAdd);

      });

    } else {
      console.log("note invalide");
    }
  }
}
