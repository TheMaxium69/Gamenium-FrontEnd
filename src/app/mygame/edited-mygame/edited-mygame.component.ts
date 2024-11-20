import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {ActivatedRoute} from "@angular/router";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {DeviseInterface} from "../../-interface/devise.interface";
import {HmgCopyRegionService} from "../../-service/hmg-copy-region.service";
import {HmgCopyRegionInterface} from "../../-interface/hmg-copy-region.interface";
import {HmgCopyEtatInterface} from "../../-interface/hmg-copy-etat.interface";
import {HmgCopyFormatInterface} from "../../-interface/hmg-copy-format.interface";
import {DeviseService} from "../../-service/devise.service";
import {HmgCopyFormatService} from "../../-service/hmg-copy-format.service";
import {HmgCopyEtatService} from "../../-service/hmg-copy-etat.service";
import {NgForm} from "@angular/forms";
import {MyGameInterface} from "../../-interface/my-game.interface";

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
    private deviseService:DeviseService,
    private hmgCopyEtatService:HmgCopyEtatService,
    private hmgCopyFormatService:HmgCopyFormatService,
    private hmgCopyRegionService:HmgCopyRegionService,
  ) {}

  idOneMyGame:number|any;
  selectedMyGame:HistoryMyGameInterface|undefined;
  deviseAll:DeviseInterface[]|undefined;
  hmgCopyEtatAll:HmgCopyEtatInterface[]|undefined;
  hmgCopyFormatAll:HmgCopyFormatInterface[]|undefined;
  hmgCopyRegionAll:HmgCopyRegionInterface[]|undefined;


  ngOnInit() {

    this.idOneMyGame = this.route.snapshot.paramMap.get('editid');

    if (this.idOneMyGame) {
      this.getAllInfo();
      this.getMyGame(this.idOneMyGame);
    }
  }

  getMyGame(idEditedMyGame: number){

    this.historyMyGameService.getOneMyGame(idEditedMyGame, this.app.setURL()).subscribe((reponseMyGame: { message: string; result: HistoryMyGameInterface | undefined; }) => {

      if (reponseMyGame.message == "good") {
        this.selectedMyGame = reponseMyGame.result;
        console.log(this.selectedMyGame)
      } else {
        console.log("pas de mygame")
      }

    })

  }


  getAllInfo(){

    this.deviseService.getAllDevise(this.app.setURL()).subscribe((reponseDevise: { message: string; result: DeviseInterface[] | undefined; }) => {

      if (reponseDevise.message == "good") {
        this.deviseAll = reponseDevise.result;
      } else {
        console.log("pas de devise");
      }

    })

    this.hmgCopyEtatService.getAllHmgCopyEtat(this.app.setURL()).subscribe((reponseEtat: { message: string; result: HmgCopyEtatInterface[] | undefined; }) => {

      if (reponseEtat.message == "good") {
        this.hmgCopyEtatAll = reponseEtat.result;
      } else {
        console.log("pas de hmgCopyEtat");
      }

    })

    this.hmgCopyFormatService.getAllHmgCopyFormat(this.app.setURL()).subscribe((reponseFormat: { message: string; result: HmgCopyFormatInterface[] | undefined; }) => {

      if (reponseFormat.message == "good") {
        this.hmgCopyFormatAll = reponseFormat.result;
      } else {
        console.log("pas de hmgCopyFormat");
      }

    })

    this.hmgCopyRegionService.getAllHmgCopyRegion(this.app.setURL()).subscribe((reponseRegion: { message: string; result: HmgCopyRegionInterface[] | undefined; }) => {

      if (reponseRegion.message == "good") {
        this.hmgCopyRegionAll = reponseRegion.result;
      } else {
        console.log("pas de hmgCopyRegion");
      }


    })

  }


  /*
  *
  * UPDATE MY GAME
  *
  * */

  updateMyGame(form: NgForm){

    // console.log(form.value);

    /* SAVOIR LE NOMBRE DE COPY*/
    let copyCount: number = 0;
    for (const property in form.value) {
      if (form.value.hasOwnProperty(property) && property.startsWith('copy')) {
        copyCount++;
      }
    }
    // console.log(`Number of copies: ${copyCount}`);

    /* MODIFIER LE MYGAME */
    let newMyGame = {
      id: form.value.myGameId,
      is_pinned: form.value.is_pinned,
      difficulty_rating: form.value.difficulty_rating,
      lifetime_rating: form.value.lifetime_rating,
      wish_list: form.value.wish_list,
    };

    /* MODIFIER LA NOTE */
    let newRate = {
      id: form.value.myGameId || null,
      rating: form.value.rating,
    }

    /* MODIFIER LES COPY */

    let newCopyGame = []
    for (let i = 0; i < copyCount; i++) {


      let tempPurchase = {
        id: form.value['purchase' + i] || null,
        price: form.value['purchase_price' + i],
        content: form.value['purchase_content' + i],
        devise_id: form.value['purchase_devise' + i],
        buy_where_id: form.value['purchase_buy_where' + i],
        buy_date: form.value['purchase_buy_date' + i],
      }

      let tempMyGame = {
        id: form.value['copy' + i],
        edition: form.value['edition' + i],
        barcode: form.value['barcode' + i],
        content: form.value['content' + i],
        purchase: tempPurchase,
        etat_id: form.value['etat' + i],
        format_id: form.value['format' + i],
        region_id: form.value['region' + i],
      }

      newCopyGame.push(tempMyGame);

    }


    /* MODIFIER LES SPEEDRUN */
      let newSpeedrun: any[] = []
    /* MODIFIER LES SCREENSHOT */
      let newScreenshot: any[] = []

    /* FINAL FORMATAGE */
    let updateHistoryMyGame = {
      myGame: newMyGame,
      copyGame: newCopyGame,
      rate: newRate,
      speedrun:newSpeedrun,
      screenshot:newScreenshot
    }

    // console.log(updateHistoryMyGame);

    let body = JSON.stringify(updateHistoryMyGame);

    this.historyMyGameService.updateMyGame(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseMyGameUpdate:{ message:string, result:HistoryMyGameInterface}) => {
      console.log(reponseMyGameUpdate);
      if (reponseMyGameUpdate.message == "updated game") {
        this.selectedMyGame = reponseMyGameUpdate.result;
        console.log(this.selectedMyGame);
      } else {
        console.log("Erreur de mise a jour");
      }
    })

  }







}
