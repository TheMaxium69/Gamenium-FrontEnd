import {AfterContentInit, AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../-service/game.service";
import {AppComponent} from "../../app.component";
import {GameInterface} from "../../-interface/game.interface";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {NgForm} from "@angular/forms";
import { HistoryMyGameInterface } from 'src/app/-interface/history-my-game.interface';
import { ViewService } from 'src/app/-service/view.service';
import { ApicallInterface } from 'src/app/-interface/apicall.interface';
import {GiantbombService} from "../../-service/api/giantbomb.service";
import {MetacriticService} from "../../-service/api/metacritic.service";
import {GiantbombInterface} from "../../-interface/api/giantbomb.interface";
import {MetacricInterface} from "../../-interface/api/metacric.interface";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-detail-game',
  templateUrl: './detail-game.component.html',
  styleUrls: ['./detail-game.component.css']
})
export class DetailGameComponent implements OnInit{

  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  hasGameInCollection : boolean = false;

  userColor : string | undefined;

  gameId: number|any;
  gameSelected: GameInterface|undefined;
  noneGame: boolean = false;

  mouseDown: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private viewService: ViewService,
    protected app: AppComponent,
    private histoireMyGameService: HistoryMyGameService,
    private giantbombService: GiantbombService,
    private metacriticService: MetacriticService,
  ) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');
    this.getGameById(this.gameId)

    if (this.app.isLoggedIn){
      this.myGameByUser(this.app.userConnected.id);
      this.userColor = this.app.userConnected.themeColor;
    }

  }

  getGameById(id:number){

    this.gameService.getGameById(id, this.app.setURL()).subscribe((reponseGameOne) => {

      if (reponseGameOne.message == "good"){

        this.gameSelected = reponseGameOne.result
        if (this.gameSelected){
          this.addViewGame(this.gameSelected.id)
          this.getOtherApi(this.gameSelected);
        }

      } else {

        this.noneGame = true;

      }


    });
  }

  myGameByUser(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
        this.hasGameInCollection = this.checkHasGameInCollection(Number(this.gameId));
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
    });
  }

  checkHasGameInCollection(gameId: number): boolean {
    if (!this.myGameHistoriqueAll || this.myGameHistoriqueAll.length === 0) {
      return false;
    }

    for (let entry of this.myGameHistoriqueAll) {
      if (entry.myGame?.game?.id === gameId) {
        return true;
      }
    }

    return false;

  }



  // Drag carousel provider cards
  startDrag(mouse: MouseEvent): void {
    console.log('drag start') // A SUPPRIMER
    const slider = document.querySelector('.provider-card-container') as HTMLElement;

    if (slider) {
      this.mouseDown = true;
      this.startX = mouse.pageX - slider.offsetLeft;
      this.scrollLeft = slider.scrollLeft;

      slider.classList.add('no-select');
    }

  }

  stopDrag(): void {
    console.log('drag stop') // A SUPPRIMER
    const slider = document.querySelector('.provider-card-container') as HTMLElement;
    this.mouseDown = false;

    if (slider) {
      slider.classList.remove('no-select');
    }

    document.body.classList.remove('no-select');
  }

  move(mouse: MouseEvent): void {

    if (!this.mouseDown) {
      return;
    }

    console.log('drag en cours') // A SUPPRIMER
    const slider = document.querySelector('.provider-card-container') as HTMLElement;

    mouse.stopPropagation();

    if (slider) {
      const x = mouse.pageX - slider.offsetLeft;
      const scroll = x - this.startX;
      slider.scrollLeft = this.scrollLeft - scroll;
    }

  }

  setModal(){
    this.app.gameSelected = this.gameSelected;
  }

  addViewGame(id:number){
    setTimeout(() => {

      let bodyNoJson = {
        "id": id,
        "ip": "10.10.10.10"
      }

      let body = JSON.stringify(bodyNoJson);

      this.viewService.addGameView(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseAddViewActu:ApicallInterface) => {
        if (reponseAddViewActu.message == "good"){
          console.log("+1 vue");
        }
      })

    }, this.app.deadlineView)
  }


  /*
  *
  * PRESS and OTHER API
  *
  * */

  GiantBomb:GiantbombInterface|null = null
  Metacritic:MetacricInterface|null = null;
  isLoadingApiOther:boolean = true;

  game_genres:string[] = [];
  game_developpers:string[] = [];
  game_publishers:string[] = [];
  game_franchises:string[] = [];
  game_releasedate:string|undefined;

  getOtherApi(game: GameInterface){

    /* GIANT BOMB*/
    const giantBomb$ = this.giantbombService.getGame(this.app.urlApiGiantbomb, game.name, game.guid);

    /* METACRITIC */
    const metacritic$ = this.metacriticService.getGame(this.app.urlApiMetacritic, game.name);

    /* UNE FOIS TOUTE LES API REPONDU*/
    forkJoin([giantBomb$, metacritic$]).subscribe(([reponseGiantbomb, reponseMetacritic]: [GiantbombInterface, MetacricInterface]) => {
      this.isLoadingApiOther = false;

      this.GiantBomb = reponseGiantbomb;
      this.Metacritic = reponseMetacritic;

      if (this.GiantBomb){

        this.game_genres = this.GiantBomb.detail.genre.map(g => g.name) || [];
        this.game_developpers = this.GiantBomb.detail.developer.map(g => g.name) || [];
        this.game_publishers = this.GiantBomb.detail.publisher.map(g => g.name) || [];
        this.game_franchises = this.GiantBomb.detail.franchises.map(g => g.name) || [];

      }

      if (this.Metacritic){

        if (this.game_genres.length == 0){
          this.game_genres = this.Metacritic.genres || [];
        }
        if (this.game_developpers.length == 0){
          this.game_developpers = this.Metacritic.developers || [];
        }
        if (this.game_publishers.length == 0){
          this.game_publishers.push(this.Metacritic.publishers || '');
        }


      }

      console.log(this.game_genres);
      console.log(this.game_developpers);
      console.log(this.game_publishers);
      console.log(this.game_franchises);





    }, (error) => this.isLoadingApiOther = false);

  }


}
