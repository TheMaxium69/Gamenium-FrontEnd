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
import { HmgTagsInterface } from 'src/app/-interface/hmg-tags.interface';
import {HmgTagsService} from "../../-service/hmg-tags.service";
import { HmgCopyLanguageService } from 'src/app/-service/hmg-copy-language.service';
import { HmgCopyLanguageInterface } from 'src/app/-interface/hmg-copy-language.interface';
import {HmgScreenshotInterface} from "../../-interface/hmg-screenshot.interface";
import {HmgScreenshotService} from "../../-service/hmg-screenshot.service";

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
    private buyWhereService:BuyWhereService,
    private hmgCopyEtatService:HmgCopyEtatService,
    private hmgCopyFormatService:HmgCopyFormatService,
    private hmgCopyRegionService:HmgCopyRegionService,
    private hmgTagsService:HmgTagsService,
    private hmgLanguageService:HmgCopyLanguageService,
    private hmgScreenshotService:HmgScreenshotService
  ) {}

  /* SELECTED */
  idOneMyGame:number|any;
  selectedMyGame:HistoryMyGameInterface|undefined;

  /*
  *
  * FORMULAIRE GESTION
  *
  * */
  tabSelected:number = 1;
  isNew:string ="new";

  /* HmgCopy*/
  idFormValideCopy: number[] = [];
  nbCopyView:number = 0;
  nbCopy:number = 0;
  nbCopyExisting:number = 0;
  nbCopyGenerate:number = 10;

  /* HmgSpeedrun*/
  idFormValideSpeedrun: number[] = [];
  nbSpeedrunView:number = 0;
  nbSpeedrun:number = 0;
  nbSpeedrunExisting:number = 0;
  nbSpeedrunGenerate:number = 10;




  debug(){console.log(this.idFormValideCopy)}


  ngOnInit() {

    this.idOneMyGame = this.route.snapshot.paramMap.get('editid');

    if (this.idOneMyGame) {
      this.getAllInfo(); /* GET VARIABLE GLOBAL */
      this.getMyGame(this.idOneMyGame); /* GET LE JEUX */
    }
  }

  /* RECUPRE LE JEUX*/
  getMyGame(idEditedMyGame: number){

    this.historyMyGameService.getOneMyGame(idEditedMyGame, this.app.setURL()).subscribe((reponseMyGame: { message: string; result: HistoryMyGameInterface | undefined; }) => {

      if (reponseMyGame.message == "good") {
        this.selectedMyGame = reponseMyGame.result;

        if (this.selectedMyGame){
          /* TAG*/
          this.selectedMyGame.myGame.hmgTags.forEach(oneTags => {
            this.tagsSelectedUser.push(oneTags.id);
          })

          /* LANG */
          let i = 0;
          this.selectedMyGame.copyGame.forEach(oneCopy => {
            oneCopy.language.forEach(oneCopyLanguage => {
              this.hmgCopyLanguageSelected[i].push(oneCopyLanguage.id);
            })
            i++
          })
        }

        /* GEREZ LES COPY*/
        this.calcCopy();

        /* GEREZ LES SPEEDRUN*/
        this.calcSpeedrun();

      } else {
        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de la BDD',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.colorDefault
        })
      }

    }, (error) => this.app.erreurSubcribe() )

  }

  /* GET VARIABLE GLOBAL*/
  getAllInfo(){

    if (this.app.deviseNoReload.length == 0){
      this.deviseService.getAllDevise(this.app.setURL()).subscribe((reponseDevise: { message: string; result: DeviseInterface[]; }) => {
        if (reponseDevise.message == "good") {
          this.app.deviseNoReload = reponseDevise.result;
        }
      })
    }


    if (this.app.buyWhereUserNoReload.length === 0 ){
      this.buyWhereService.getAllBuyWheresByUser(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseBuyWhere: { message: string; result: BuyWhereInterface[]; }) => {
        if (reponseBuyWhere.message == "good") {
          this.app.buyWhereUserNoReload = reponseBuyWhere.result;
        }
      })
    }

    if (this.app.hmgCopyEtatAllNoReload.length === 0 ){
      this.hmgCopyEtatService.getAllHmgCopyEtat(this.app.setURL()).subscribe((reponseEtat: { message: string; result: HmgCopyEtatInterface[]; }) => {
        if (reponseEtat.message == "good") {
          this.app.hmgCopyEtatAllNoReload = reponseEtat.result;
        }
      })
    }

    if (this.app.hmgCopyFormatAllNoReload.length === 0 ){
      this.hmgCopyFormatService.getAllHmgCopyFormat(this.app.setURL()).subscribe((reponseFormat: { message: string; result: HmgCopyFormatInterface[]; }) => {
        if (reponseFormat.message == "good") {
          this.app.hmgCopyFormatAllNoReload = reponseFormat.result;
        }
      })
    }


    if (this.app.hmgCopyRegionAllNoReload.length === 0 ){
      this.hmgCopyRegionService.getAllHmgCopyRegion(this.app.setURL()).subscribe((reponseRegion: { message: string; result: HmgCopyRegionInterface[]; }) => {
        if (reponseRegion.message == "good") {
          this.app.hmgCopyRegionAllNoReload = reponseRegion.result;
        }
      })
    }


    if (this.app.tagsUserNoReload.length === 0){
      this.hmgTagsService.getTagsAllByUser(this.app.setURL(), this.app.createCorsToken()).subscribe((response) => {
        if(response.message == "good"){
          this.app.tagsUserNoReload = response.result;
        }
      })
    }

    if (this.app.HmgCopyLanguageNoReload.length == 0){
      this.hmgLanguageService.getAllHmgCopyLanguage(this.app.setURL()).subscribe((responseLanguage: { message: string; result:HmgCopyLanguageInterface[]; }) => {
        if (responseLanguage.message == "good") {
          this.app.HmgCopyLanguageNoReload = responseLanguage.result;
        }
      })
    }



  }

  /*
  *
  * AFFICHAGE
  *
  * */

  tagsSelectedUser: number[] = []

  /* FOR TAGS IS CHECKED */
  isTagInSelected(tagId: number): boolean {
    if(this.tagsSelectedUser.some((id: number) => id === tagId)){
      return true;
    } else {
      return false;
    }
  }

  toggleTags(tagId: number){
    if (this.tagsSelectedUser.includes(tagId)) {
      this.tagsSelectedUser = this.tagsSelectedUser.filter(id => id !== tagId);
    } else {
      this.tagsSelectedUser.push(tagId);
    }
  };


  hmgCopyLanguageSelected: number[][] = Array(this.nbCopyExisting + this.nbCopyGenerate).fill([]).map(() => []);

  debugLang(){console.log(this.hmgCopyLanguageSelected)}

  /* LANGUAGE LOGIC */
  isInLanguageSelected(languageId: number, copyIndex:number): boolean {
    if(this.hmgCopyLanguageSelected[copyIndex].some((id: number) => id === languageId)){
      return true;
    } else {
      return false;
    }
  }

  toggleLanguages(languageId: number, copyIndex: number){
    if (this.hmgCopyLanguageSelected[copyIndex]){
      if (this.hmgCopyLanguageSelected[copyIndex].includes(languageId)) {
        this.hmgCopyLanguageSelected[copyIndex] = this.hmgCopyLanguageSelected[copyIndex].filter(id => id !== languageId);
      } else {
        this.hmgCopyLanguageSelected[copyIndex].push(languageId);
      }
    } else {
      /* Créer et ajouter la premier lang*/
    }

  };



  tabActive(tab:number){
    this.tabSelected = tab;
  }

  /* AFFICHER UN PREMIER EXEMPLAIRE/SPEEDRUN A 0*/
  displayDefault(id:number):string {
    if (id==0){
      return "flex";
    } else {
      return 'none';
    }
  }

  /*
  *
  * GESTION EXEMPLAIRE
  *
  * */

  /* GEREZ LA PREMIER AFFICHAGE DES COPY*/
  calcCopy(){
    if (this.selectedMyGame?.copyGame){
      this.nbCopyExisting = this.selectedMyGame.copyGame.length
      this.nbCopyView = this.nbCopyExisting
      while (this.nbCopyExisting >= this.nbCopyGenerate) {
        this.nbCopyGenerate = this.nbCopyGenerate * 2;
      }
      this.nbCopy = this.nbCopyGenerate - this.nbCopyExisting;
      for (let i = 0; i < this.nbCopyExisting; i++) {
        this.idFormValideCopy.push(i)
      }

      if (this.nbCopyExisting == 0){
        this.nbCopyView++;
        this.idFormValideCopy.push(0);
      }

    }
  }

  /* ADD EXEMPLAIRE*/
  addCopyGame() {

    let formId = 0;
    // console.log('Question ? =' + formId)
    if (this.idFormValideCopy.includes(formId)){
      while (this.idFormValideCopy.includes(formId)) {
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
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
    } else {
      this.nbCopyView++;
      this.idFormValideCopy.push(formId);
      cardCopy.style.display = 'flex';
    }

  }

  /* SUPPRMIER UNE COPY*/
  deleteCopyGame(id:number) {
    let copyCardSelected = document.getElementById('copyCard'+id)

    if (copyCardSelected) {
      this.idFormValideCopy = this.idFormValideCopy.filter(formId => formId !== id);
      this.nbCopyView--;
      copyCardSelected.style.display = 'none';

      // VIDER LES CHAMP
      const inputs = copyCardSelected.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
      });

      const selects = copyCardSelected.querySelectorAll('select');
      selects.forEach(select => {
        select.selectedIndex = 0;
      });

      const textareas = copyCardSelected.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        textarea.value = '';
      });

    } else {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur inatendu',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
    }


  }

  /* VERIFIER SI IL Y A 0 COPY */
  noRealCopy():string{
    if (this.selectedMyGame?.copyGame.length == 0 && this.nbCopyView != 0){
      return "*"
    } else {
      return "";
    }
  }

  /*
  *
  * END GESTION EXEMPLAIRE
  *
  * */

  /*
  *
  * GESTION SPEEDRUN
  *
  * */

  calcSpeedrun(){
    if (this.selectedMyGame?.speedrun){
      this.nbSpeedrunExisting = this.selectedMyGame.speedrun.length
      this.nbSpeedrunView = this.nbSpeedrunExisting
      while (this.nbSpeedrunExisting >= this.nbSpeedrunGenerate) {
        this.nbSpeedrunGenerate = this.nbSpeedrunGenerate * 2;
      }
      this.nbSpeedrun = this.nbSpeedrunGenerate - this.nbSpeedrunExisting;
      for (let i = 0; i < this.nbSpeedrunExisting; i++) {
        this.idFormValideSpeedrun.push(i)
      }

      if (this.nbSpeedrunExisting == 0){
        this.nbSpeedrunView++;
        this.idFormValideSpeedrun.push(0);
      }

    }
  }

  /* ADD SPEEDRUN*/
  addSpeedrun(){

    let formId = 0;
    // console.log('Question ? =' + formId)
    if (this.idFormValideSpeedrun.includes(formId)){
      while (this.idFormValideSpeedrun.includes(formId)) {
        formId++;
        // console.log('Question ? =' + formId)
      }
    }

    // console.log('DISPO = ' + formId)

    let cardSpeedrun = document.getElementById('speedrunCard' + formId.toString());
    if (!cardSpeedrun) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez sauvegardez et recommancez',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
    } else {
      this.nbSpeedrunView++;
      this.idFormValideSpeedrun.push(formId);
      cardSpeedrun.style.display = 'flex';
    }

  }

  /* SUPPRIMER UN SPEEDRUN */
  deleteSpeedrun(id:number){
    let speedrunCardSelected = document.getElementById('speedrunCard'+id)

    if (speedrunCardSelected) {
      this.idFormValideSpeedrun = this.idFormValideSpeedrun.filter(formId => formId !== id);
      this.nbSpeedrunView--;
      speedrunCardSelected.style.display = 'none';

      // VIDER LES CHAMP
      const inputs = speedrunCardSelected.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
      });

      const selects = speedrunCardSelected.querySelectorAll('select');
      selects.forEach(select => {
        select.selectedIndex = 0;
      });

      const textareas = speedrunCardSelected.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        textarea.value = '';
      });

    } else {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur inatendu',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
    }
  }


  /* VERIFIER SI IL Y A 0 SPEEDRUN */
  countSpeedrunView():string{
    if (this.selectedMyGame?.speedrun.length == 0 && this.nbSpeedrun != 0){
      return "0"
    } else {
      return this.nbSpeedrunView.toString();
    }
  }


  /*
  *
  * GESTION EXEMPLAIRE
  *
  * */

  /*
  *
  * UPDATE MY GAME
  *
  * */

  updateMyGame(form: NgForm){

    // console.log(form.value);

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
      hmgTags: this.tagsSelectedUser,
    };

    /* MODIFIER LA NOTE */
    let newRate = {
      id: form.value.myGameId || null,
      rating: form.value.rating,
      content: form.value['content_rating']
    }


    /* SAVOIR LE NOMBRE DE COPY*/
    let copyCount: number = 0;
    for (const property in form.value) {
      if (form.value.hasOwnProperty(property) && property.startsWith('copy')) {
        copyCount++;
      }
    }

    /* MODIFIER LES COPY */
    let newCopyGame = []
    for (let i = 0; i < copyCount; i++) {

      if (this.idFormValideCopy.includes(i)) {
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
          hmgLanguages:this.hmgCopyLanguageSelected[i],
        }

        newCopyGame.push(tempMyGame);
      }

    }

    /* SAVOIR LE NOMBRE DE SPEEDRUN*/
    let speedrunCount: number = 0;
    for (const property in form.value) {
      if (form.value.hasOwnProperty(property) && property.startsWith('speedrun')) {
        speedrunCount++;
      }
    }

    /* MODIFIER LES SPEEDRUN */
    let newSpeedrun: any[] = []
    for (let i = 0; i < speedrunCount; i++) {

      if (this.idFormValideSpeedrun.includes(i)) {

        let tempSpeedrun = {}
        if (form.value['speedrun' + i] == "new") {
          tempSpeedrun = {
            category: form.value['category' + i],
            chrono: form.value['chrono' + i],
            link: form.value['link' + i]
          }
        } else {
          tempSpeedrun = {
            id: form.value['speedrun' + i],
            category: form.value['category' + i],
            chrono: form.value['chrono' + i],
            link: form.value['link' + i]
          }
        }

        newSpeedrun.push(tempSpeedrun);
      }

    }

    /*BUGFIX speedrun*/

    let bugNoSpeedrun = false
    if (newSpeedrun.length == 1) {
      if (newSpeedrun[0].category == "" && newSpeedrun[0].chrono == "") {
        newSpeedrun = [];
        bugNoSpeedrun = true;
      }
    }


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

    // return console.log(updateHistoryMyGame)
    // console.log(updateHistoryMyGame)

    let body = JSON.stringify(updateHistoryMyGame);

    this.historyMyGameService.updateMyGame(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseMyGameUpdate:{ message:string, result:HistoryMyGameInterface}) => {
      if (reponseMyGameUpdate.message == "updated game") {

        this.selectedMyGame = reponseMyGameUpdate.result;
        // console.log(reponseMyGameUpdate.result);

        if (this.app.myGameAll){
          const index = this.app.myGameAll.findIndex(item => item.myGame.id === reponseMyGameUpdate.result.myGame.id);
          if (index !== -1) {
            this.app.myGameAll[index] = reponseMyGameUpdate.result;
            this.app.myGameAll[index].tempNote = reponseMyGameUpdate.result.rate.rating;
          }
        }


        /* RE SYNCRO LES TAGS */
        if (this.selectedMyGame){
          this.selectedMyGame.myGame.hmgTags.forEach(oneTags => {
            this.tagsSelectedUser.push(oneTags.id);
          })
        }

        /* RE SYNCRO LES LANG */
        if (this.selectedMyGame){
          let i = 0;
          this.selectedMyGame.copyGame.forEach(oneCopy => {
            this.hmgCopyLanguageSelected[i] = [];
            oneCopy.language.forEach(oneCopyLanguage => {
              this.hmgCopyLanguageSelected[i].push(oneCopyLanguage.id);
            })
            i++
          })
        }

        this.calcSpeedrun() /* CALCULER CAR QUAND UN SPEEDRUN EST VIDE IL LE SUPPRIME*/

        /* BUF FIX SUR LES NOUVEAU EXEMPLAIRE QUI CE DUPLIQUE*/
        this.idFormValideCopy.forEach((idForm: number) => {
          let id:any = '.copyCard' + idForm
          document.querySelectorAll(id).forEach((element: HTMLElement) => {
            element.style.display = 'none';

            // VIDER LES CHAMP
            const inputs = element.querySelectorAll('input');
            inputs.forEach(input => {
              input.value = '';
            });

            const selects = element.querySelectorAll('select');
            selects.forEach(select => {
              select.selectedIndex = 0;
            });

            const textareas = element.querySelectorAll('textarea');
            textareas.forEach(textarea => {
              textarea.value = '';
            });
          });
        });

        /* BUF FIX SUR LES NOUVEAU EXEMPLAIRE QUI CE DUPLIQUE*/
        this.idFormValideSpeedrun.forEach((idForm: number) => {
          let id:any = '.speedrunCard' + idForm
          document.querySelectorAll(id).forEach((element: HTMLElement) => {
            element.style.display = 'none';

            // VIDER LES CHAMP
            const inputs = element.querySelectorAll('input');
            inputs.forEach(input => {
              input.value = '';
            });

            const selects = element.querySelectorAll('select');
            selects.forEach(select => {
              select.selectedIndex = 0;
            });

            const textareas = element.querySelectorAll('textarea');
            textareas.forEach(textarea => {
              textarea.value = '';
            });
          });
        });

        if (bugNoSpeedrun){
          let firstSpeedrun = document.getElementById("speedrunCard0")
          if (firstSpeedrun){
            firstSpeedrun.style.display = "flex";
          }
        }


        Swal.fire({
          title: 'Succès!',
          text: 'Votre jeux à bien été mise à jour.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
        })

      } else {

        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de la mise à jour de votre jeux',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
        })

      }
    }, (error) => (
      Swal.fire({
        title: 'Erreur!',
        text: 'Échec de la mise à jour de votre jeux',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
      })
    ))

  }

  /*
  *
  * END UPDATE MY GAME
  *
  * */

  /*
  *
  * SCREENSHOT
  *
  * */

  deleteScreenshot(screenshot: HmgScreenshotInterface, index:number) {

    this.hmgScreenshotService.deleteScreenshot(screenshot.id, this.app.setURL(), this.app.createCorsToken()).subscribe((responseUploadScreenshot:{message:string}) => {
      if (responseUploadScreenshot.message == "good"){
       if (this.selectedMyGame){
         this.selectedMyGame.screenshot.splice(index, 1);
       }

        Swal.fire({
          title: 'Succès!',
          text: 'Votre screenshot à bien été supprimé.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
        })

      } else {

        Swal.fire({
          title: 'Échec!',
          text: 'Échec de la suppresion de votre screenshot.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
        })
      }
    }, (error) => { this.app.erreurSubcribe() })




  }

  onChangeScreenshot(newScreenshot:HmgScreenshotInterface){
    this.selectedMyGame?.screenshot.push(newScreenshot);
  }

  /*
  *
  * END SCREENSHOT
  *
  * */



}
