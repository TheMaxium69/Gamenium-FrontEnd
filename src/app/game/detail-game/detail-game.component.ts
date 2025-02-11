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
import {ProviderInterface} from "../../-interface/provider.interface";
import {ProviderService} from "../../-service/provider.service";
import {TestInterface} from "../../-interface/test.interface";

@Component({
  selector: 'app-detail-game',
  templateUrl: './detail-game.component.html',
  styleUrls: ['./detail-game.component.css']
})
export class DetailGameComponent implements OnInit{

  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  hasGameInCollection : boolean = false;

  gameId: number|any;
  gameSelected: GameInterface|undefined;
  noneGame: boolean = false;

  testGame: TestInterface[] = [];
  moyenGameniumPress: number|undefined = undefined;
  moyenRatePress: string = "NA";

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
    private providerService:ProviderService,
  ) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');
    this.getGameById(this.gameId)

    if (this.app.isLoggedIn){
      this.myGameByUser(this.app.userConnected.id);
    }

  }

  getGameById(id:number){

    this.gameService.getGameById(id, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseGameOne) => {

      if (reponseGameOne.message == "good"){

        this.gameSelected = reponseGameOne.result
        if (this.gameSelected){
          this.addViewGame(this.gameSelected.id)
          this.getOtherApi(this.gameSelected);
        }

        this.testGame = reponseGameOne.result2
        if (this.testGame){
          let AllNoteGamenium: number[] = [];
          this.testGame.forEach((test: TestInterface) => {
            AllNoteGamenium.push(test.rating);
          });
          this.moyenGameniumPress = this.obtainMoyenPressGamenium(AllNoteGamenium);
          this.moyenRatePress = this.obtainMoyenPress();
        }

      } else {

        this.noneGame = true;

      }


    });
  }

  myGameByUser(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL(), this.app.createCorsToken()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
        this.hasGameInCollection = this.checkHasGameInCollection(Number(this.gameId));
      } else {
        // console.log("pas de jeux trouvé pour l'utilisateur")
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
    // console.log('drag start') // A SUPPRIMER
    const slider = document.querySelector('.provider-card-container') as HTMLElement;

    if (slider) {
      this.mouseDown = true;
      this.startX = mouse.pageX - slider.offsetLeft;
      this.scrollLeft = slider.scrollLeft;

      slider.classList.add('no-select');
    }

  }

  stopDrag(): void {
    // console.log('drag stop') // A SUPPRIMER
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

    // console.log('drag en cours') // A SUPPRIMER
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
        "id": id
      }

      let body = JSON.stringify(bodyNoJson);

      this.viewService.addGameView(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseAddViewActu:ApicallInterface) => {
        if (reponseAddViewActu.message == "good"){
          // console.log("+1 vue");
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

  providerSelected:ProviderInterface[] = [];

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
      this.moyenRatePress = this.obtainMoyenPress();

      /*
      *
      * CHOOSE INFO
      *
      * */
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

      /*
      *
      * GET PROVIDER
      *
      * */

      if (this.game_franchises.length > 0){
        let i = 0;
        this.game_publishers.forEach((publisherName:string)=>{
          if (i < this.app.maxSearchProviderByGame && publisherName.length > 3){
            if (this.app.publisherNameFormatage(publisherName) == "Xbox"){
              this.providerService.searchProviders("Microsoft", 1, this.app.setURL(), this.app.createCorsToken()).subscribe((reponse:ProviderInterface[]) => {
                // console.log(reponse);
                if (reponse.length > 0){
                  if (!this.providerSelected.some(provider => provider.id === reponse[0].id)) {
                    this.providerSelected.push(reponse[0]);
                  }
                }
              });
            }
            this.providerService.searchProviders(this.app.publisherNameFormatage(publisherName), 1, this.app.setURL(), this.app.createCorsToken()).subscribe((reponse:ProviderInterface[]) => {
              // console.log(reponse);
              if (reponse.length > 0){
                if (!this.providerSelected.some(provider => provider.id === reponse[0].id)) {
                  this.providerSelected.push(reponse[0]);
                }
              }
            });
          }
          i++
        })
      }





    }, (error) => this.isLoadingApiOther = false);

  }

  obtainMoyenPressGamenium(AllNoteGamenium: number[]): number|undefined {

    const totalScores = AllNoteGamenium.reduce((sum, score) => sum + score, 0);
    const numberOfScores = AllNoteGamenium.length;

    let result = numberOfScores > 0 ? totalScores / numberOfScores : 0;
    const formattedResult = Number(result.toFixed(1));

    if (formattedResult == 0) {
      return undefined;
    } else {
      return formattedResult;
    }

  }
  obtainMoyenPress(): string {
    let metacriticScore:number = 0;
    let GameniumPress:number = 0;

    if (this.Metacritic?.metacritic_score !== 0 && this.Metacritic?.metacritic_score) {
      metacriticScore = Number(this.Metacritic.metacritic_score ?? 0) / 5; // sur 100, convertir sur 20
    }
    if (this.moyenGameniumPress) {
      GameniumPress = this.moyenGameniumPress;
    }

    if (metacriticScore == 0 && GameniumPress == 0){
      return "NA";
    }

    const totalScores = metacriticScore + GameniumPress;
    const numberOfScores = [metacriticScore, GameniumPress].filter(score => score > 0).length;

    let result = numberOfScores > 0 ? totalScores / numberOfScores : 0
    const formattedResult = Number(result.toFixed(1));

    if (formattedResult == 0){
      return "NA";
    } else {
      return formattedResult.toString();
    }
  }

  obtainMoyenUser(): string {
    const metacriticScore = Number(this.Metacritic?.users_score ?? 0) * 2; // sur 10, convertir sur 20
    const giantBombScore = Number(this.GiantBomb?.average_score ?? 0) * 4; // sur 5, convertir sur 20
    const gameSelectedScore = Number(this.gameSelected?.moyenRateUser ?? 0); // sur 20

    const totalScores = metacriticScore + giantBombScore + gameSelectedScore;
    const numberOfScores = [metacriticScore, giantBombScore, gameSelectedScore].filter(score => score > 0).length;

    let result = numberOfScores > 0 ? totalScores / numberOfScores : 0
    const formattedResult = Number(result.toFixed(1));

    if (formattedResult == 0){
      return "NA";
    } else {
      return formattedResult.toString();
    }

  }



  //si une image n'est pas load
  errorImg(id:number) {

    this.GiantBomb?.picture.splice(id,1)

  }


}
