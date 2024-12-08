import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {ActivatedRoute, Router} from "@angular/router";
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
import {BuyWhereInterface} from "../../-interface/buy-where.interface";
import {BuyWhereService} from "../../-service/buy-where.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edited-mygame',
  templateUrl: './edited-mygame.component.html',
  styleUrls: ['./edited-mygame.component.css']
})
export class EditedMygameComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    protected app: AppComponent,

    private router: Router,
    protected historyMyGameService:HistoryMyGameService,
    private deviseService:DeviseService,
    private buyWhereService:BuyWhereService,
    private hmgCopyEtatService:HmgCopyEtatService,
    private hmgCopyFormatService:HmgCopyFormatService,
    private hmgCopyRegionService:HmgCopyRegionService,
  ) {}

  idOneMyGame:number|any;
  selectedMyGame:HistoryMyGameInterface|undefined;
  deviseAll:DeviseInterface[]|undefined;
  buyWhereAll:BuyWhereInterface[]|undefined;
  hmgCopyEtatAll:HmgCopyEtatInterface[]|undefined;
  hmgCopyFormatAll:HmgCopyFormatInterface[]|undefined;
  hmgCopyRegionAll:HmgCopyRegionInterface[]|undefined;

  idFormValide: number[] = [];
  nbCopyView:number = 0;
  nbCopy:number = 0;
  nbCopyExisting:number = 0;
  nbCopyGenerate:number = 10;
  isNewCopy:string ="new";

  tabSelected:number = 1;

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
        if (this.selectedMyGame?.copyGame){
          this.nbCopyExisting = this.selectedMyGame.copyGame.length
          this.nbCopyView = this.nbCopyExisting
          while (this.nbCopyExisting >= this.nbCopyGenerate) {
            this.nbCopyGenerate = this.nbCopyGenerate * 2;
          }
          this.nbCopy = this.nbCopyGenerate - this.nbCopyExisting;
          for (let i = 0; i < this.nbCopyExisting; i++) {
            this.idFormValide.push(i)
          }

          if (this.nbCopyExisting == 0){
            this.nbCopyView++;
            this.idFormValide.push(0);
          }

        }
      } else {
        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de la BDD',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.colorDefault
        })
      }

    })

  }


  getAllInfo(){

    this.deviseService.getAllDevise(this.app.setURL()).subscribe((reponseDevise: { message: string; result: DeviseInterface[] | undefined; }) => {

      if (reponseDevise.message == "good") {
        this.deviseAll = reponseDevise.result;
      } else {
        // console.log("pas de devise");
      }

    })

    this.buyWhereService.getAllBuyWheres(this.app.setURL()).subscribe((reponseBuyWhere: { message: string; result: BuyWhereInterface[] | undefined; }) => {

      if (reponseBuyWhere.message == "good") {
        this.buyWhereAll = reponseBuyWhere.result;
      } else {
        // console.log("pas de buy where");
      }

    })

    this.hmgCopyEtatService.getAllHmgCopyEtat(this.app.setURL()).subscribe((reponseEtat: { message: string; result: HmgCopyEtatInterface[] | undefined; }) => {

      if (reponseEtat.message == "good") {
        this.hmgCopyEtatAll = reponseEtat.result;
      } else {
        // console.log("pas de hmgCopyEtat");
      }

    })

    this.hmgCopyFormatService.getAllHmgCopyFormat(this.app.setURL()).subscribe((reponseFormat: { message: string; result: HmgCopyFormatInterface[] | undefined; }) => {

      if (reponseFormat.message == "good") {
        this.hmgCopyFormatAll = reponseFormat.result;
      } else {
        // console.log("pas de hmgCopyFormat");
      }

    })

    this.hmgCopyRegionService.getAllHmgCopyRegion(this.app.setURL()).subscribe((reponseRegion: { message: string; result: HmgCopyRegionInterface[] | undefined; }) => {

      if (reponseRegion.message == "good") {
        this.hmgCopyRegionAll = reponseRegion.result;
      } else {
        // console.log("pas de hmgCopyRegion");
      }


    })

  }

  deleteCopyGame(id:number) {
    let copyCardSelected = document.getElementById('copyCard'+id)

    if (copyCardSelected) {
      this.idFormValide = this.idFormValide.filter(formId => formId !== id);
      this.nbCopyView--;
      copyCardSelected.style.display = 'none';

      // VIDER LES CHAMP
      const inputs = copyCardSelected.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
      });

      const selects = copyCardSelected.querySelectorAll('select');
      selects.forEach(select => {
        select.selectedIndex = -1;
      });




    } else {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur inatendu',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor
      })
    }


  }

  displayDefault(id:number):string {
    if (id==0){
      return "flex";
    } else {
      return 'none';
    }
  }

  noRealCopy():string{
    if (this.selectedMyGame?.copyGame.length == 0 && this.nbCopyView != 0){
      return "*"
    } else {
      return "";
    }
  }
  addCopyGame() {

    let formId = 0;
    // console.log('Question ? =' + formId)
    if (this.idFormValide.includes(formId)){
      while (this.idFormValide.includes(formId)) {
        formId++;
        // console.log('Question ? =' + formId)
      }
    }

    // console.log('DISPO = ' + formId)

    let cardCopy = document.getElementById('copyCard' + formId.toString());
    if (!cardCopy) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez sauvegardez et recommancez',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor
      })
    } else {
      this.nbCopyView++;
      this.idFormValide.push(formId);
      cardCopy.style.display = 'flex';
    }

  }

  /*
  *
  * UPDATE MY GAME
  *
  * */

  updateMyGame(form: NgForm){

    console.log(form.value);

    /* SAVOIR LE NOMBRE DE COPY*/
    let copyCount: number = 0;
    for (const property in form.value) {
      if (form.value.hasOwnProperty(property) && property.startsWith('copy')) {
        copyCount++;
      }
    }
    // console.log(`Number of copies: ${copyCount}`);
    let is_pinned: boolean | undefined = this.selectedMyGame?.myGame.is_pinned
    if (form.value.is_pinned == true || form.value.is_pinned == "true") {
      is_pinned = true;
    }
    if (form.value.is_pinned == false || form.value.is_pinned == "false") {
      is_pinned = false;
    }



    /* MODIFIER LE MYGAME */
    let newMyGame = {
      id: form.value.myGameId,
      is_pinned: is_pinned,
      difficulty_rating: form.value.difficulty_rating,
      lifetime_rating: form.value.lifetime_rating,
      wish_list: form.value.wish_list,
    };

    /* MODIFIER LA NOTE */
    let newRate = {
      id: form.value.myGameId || null,
      rating: form.value.rating,
      content: form.value['content_rating']
    }

    /* MODIFIER LES COPY */

    let newCopyGame = []
    for (let i = 0; i < copyCount; i++) {

      if (this.idFormValide.includes(i)) {
        let tempPurchase = {
          id: form.value['purchase' + i] || null,
          price: form.value['purchase_price' + i],
          content: form.value['purchase_content' + i],
          devise_id: form.value['purchase_devise' + i],
          buy_where_id: form.value['purchase_buy_where' + i],
          year_buy_date: form.value['purchase_year_buy_date' + i],
          month_buy_date: form.value['purchase_month_buy_date' + i],
          day_buy_date: form.value['purchase_day_buy_date' + i],
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

    }


    /* MODIFIER LES SPEEDRUN */
    let newSpeedrun: any[] = []
    /* MODIFIER LES SCREENSHOT */
    let newScreenshot: any[] = []

    console.log(newRate)
    /* FINAL FORMATAGE */
    let updateHistoryMyGame = {
      myGame: newMyGame,
      copyGame: newCopyGame,
      rate: newRate,
      speedrun:newSpeedrun,
      screenshot:newScreenshot
    }
    console.log(updateHistoryMyGame)

    let body = JSON.stringify(updateHistoryMyGame);
    console.log(body);

    this.historyMyGameService.updateMyGame(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseMyGameUpdate:{ message:string, result:HistoryMyGameInterface}) => {
      if (reponseMyGameUpdate.message == "updated game") {

        this.selectedMyGame = reponseMyGameUpdate.result;

        /* BUF FIX SUR LES NOUVEAU EXEMPLAIRE QUI CE DUPLIQUE*/
        this.idFormValide.forEach((idForm: number) => {
          let id:any = '.copyCard' + idForm
          document.querySelectorAll(id).forEach((element: HTMLElement) => {
            element.style.display = 'none';
          });
        });


        Swal.fire({
          title: 'Succès!',
          text: 'Votre jeux à bien été mise à jour.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor
        })

      } else {

        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de la mise à jour de votre jeux',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor
        })

      }
    })

  }


  tabActive(tab:number){
    this.tabSelected = tab;
  }



}
