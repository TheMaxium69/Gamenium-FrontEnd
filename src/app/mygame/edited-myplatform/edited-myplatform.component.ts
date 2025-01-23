import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BuyWhereInterface } from 'src/app/-interface/buy-where.interface';
import { DeviseInterface } from 'src/app/-interface/devise.interface';
import { HistoryMyGameInterface } from 'src/app/-interface/history-my-game.interface';
import { HistoryMyPlatformInterface } from 'src/app/-interface/history-my-platform.interface';
import { HmgCopyEtatInterface } from 'src/app/-interface/hmg-copy-etat.interface';
import { HmgCopyFormatInterface } from 'src/app/-interface/hmg-copy-format.interface';
import { HmgCopyLanguageInterface } from 'src/app/-interface/hmg-copy-language.interface';
import { HmgCopyRegionInterface } from 'src/app/-interface/hmg-copy-region.interface';
import { HmgScreenshotInterface } from 'src/app/-interface/hmg-screenshot.interface';
import { BuyWhereService } from 'src/app/-service/buy-where.service';
import { DeviseService } from 'src/app/-service/devise.service';
import { HistoryMyPlateformService } from 'src/app/-service/history-my-plateform.service';
import { HmgCopyEtatService } from 'src/app/-service/hmg-copy-etat.service';
import { HmgCopyFormatService } from 'src/app/-service/hmg-copy-format.service';
import { HmgCopyLanguageService } from 'src/app/-service/hmg-copy-language.service';
import { HmgCopyRegionService } from 'src/app/-service/hmg-copy-region.service';
import { HmgScreenshotService } from 'src/app/-service/hmg-screenshot.service';
import { HmgTagsService } from 'src/app/-service/hmg-tags.service';
import { AppComponent } from 'src/app/app.component';
import Swal from "sweetalert2";

@Component({
  selector: 'app-edited-myplatform',
  templateUrl: './edited-myplatform.component.html',
  styleUrls: ['./edited-myplatform.component.css']
})

export class EditedMyplatformComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    protected app: AppComponent,
    protected historyMyPlatformService:HistoryMyPlateformService,
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
  idOneMyPlatform:number|any;
  selectedMyPlatform:HistoryMyPlatformInterface|undefined;

  /*
  *
  * FORMULAIRE GESTION
  *
  * */
  isLoadingUpdate = false;
  tabSelected:number = 1;
  isNew:string ="new";

  /* HmgCopy*/
  idFormValideCopy: number[] = [];
  nbCopyView:number = 0;
  nbCopy:number = 0;
  nbCopyExisting:number = 0;
  nbCopyGenerate:number = 10;


  debug(){console.log(this.idFormValideCopy)}


  ngOnInit() {

    this.idOneMyPlatform = this.route.snapshot.paramMap.get('id');

    if (this.idOneMyPlatform) {
      this.getAllInfo(); /* GET VARIABLE GLOBAL */
      this.getMyPlatform(this.idOneMyPlatform); /* GET LE JEUX */
    }
  }

  /* RECUPRE LE JEUX*/
  getMyPlatform(idEditedMyGame: number){



    this.historyMyPlatformService.getOneMyHmpById(idEditedMyGame, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseMyGame: { message: string; result: HistoryMyPlatformInterface | undefined; }) => {

      if (reponseMyGame.message == "good") {
        this.selectedMyPlatform = reponseMyGame.result;

        /* GEREZ LES COPY*/
        this.calcCopy();


      } else {
        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de la BDD',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }

    }, (error) => this.app.erreurSubcribe() )

  }

  /* GET VARIABLE GLOBAL*/
  getAllInfo(){

    if (this.app.deviseNoReload.length == 0){
      this.deviseService.getAllDevise(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseDevise: { message: string; result: DeviseInterface[]; }) => {
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
      this.hmgCopyEtatService.getAllHmgCopyEtat(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseEtat: { message: string; result: HmgCopyEtatInterface[]; }) => {
        if (reponseEtat.message == "good") {
          this.app.hmgCopyEtatAllNoReload = reponseEtat.result;
        }
      })
    }

    if (this.app.hmgCopyRegionAllNoReload.length === 0 ){
      this.hmgCopyRegionService.getAllHmgCopyRegion(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseRegion: { message: string; result: HmgCopyRegionInterface[]; }) => {
        if (reponseRegion.message == "good") {
          this.app.hmgCopyRegionAllNoReload = reponseRegion.result;
        }
      })
    }

  }

  /*
  *
  * AFFICHAGE
  *
  * */

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
    if (this.selectedMyPlatform?.copyPlateform){
      this.nbCopyExisting = this.selectedMyPlatform.copyPlateform.length
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

      // console.log(this.nbCopyExisting);
      // console.log(this.nbCopyView);
      // console.log(this.nbCopyGenerate);
      // console.log(this.nbCopy);

    }
  }

  /* ADD EXEMPLAIRE*/
  addCopyPlatform() {

    if (this.nbCopyExisting >= this.app.maxCopyGame){
      Swal.fire({
        title: 'Attention!',
        text: 'Vous avez atteint le maximum d\'exemplaires',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
    } else {
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


  }

  /* SUPPRMIER UNE COPY*/
  deleteCopyPlatform(id:number) {
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
    if (this.selectedMyPlatform?.copyPlateform.length == 0 && this.nbCopyView != 0){
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
  * GESTION EXEMPLAIRE
  *
  * */

  /*
  *
  * UPDATE MY GAME
  *
  * */

  updateMyPlatform(form: NgForm){
    this.isLoadingUpdate = true;

    // console.log(form.value);

    // console.log(`Number of copies: ${copyCount}`);
    // let is_pinned: boolean | undefined = this.selectedMyPlatform?.myGame.is_pinned
    // if (form.value.is_pinned == true || form.value.is_pinned == "true") {
    //   is_pinned = true;
    // }
    // if (form.value.is_pinned == false || form.value.is_pinned == "false") {
    //   is_pinned = false;
    // }


    /* SAVOIR LE NOMBRE DE COPY*/
    let copyCount: number = 0;
    for (const property in form.value) {
      if (form.value.hasOwnProperty(property) && property.startsWith('copy')) {
        copyCount++;
      }
    }

    /* MODIFIER LES COPY */
    let newCopyPlatform = []
    for (let i = 0; i < copyCount; i++) {

      if (this.idFormValideCopy.includes(i)) {
        // console.log(form.value['purchase_price' + i] * 100)

        let tempPurchase = {
          id: form.value['purchase' + i] || null,
          price: form.value['purchase_price' + i] * 100,
          content: form.value['purchase_content' + i],
          devise_id: form.value['purchase_devise' + i],
          buy_where_id: form.value['purchase_buy_where' + i],
          year_buy_date: form.value['purchase_year_buy_date' + i],
          month_buy_date: form.value['purchase_month_buy_date' + i],
          day_buy_date: form.value['purchase_day_buy_date' + i],
        }

        let tempMyPlatform = {
          id: form.value['copy' + i],
          edition: form.value['edition' + i],
          barcode: form.value['barcode' + i],
          content: form.value['content' + i],
          isBox: form.value['isBox' + i],
          purchase: tempPurchase,
          etat_id: form.value['etat' + i],
          region_id: form.value['region' + i],
        }

        newCopyPlatform.push(tempMyPlatform);
      }

    }

    /* MODIFIER LES SCREENSHOT */
    let newScreenshot: any[] = []

    /* FINAL FORMATAGE */
    let updateHistoryMyPlatform = {
      myPlateform: this.selectedMyPlatform?.myPlateform,
      copyPlateform: newCopyPlatform,
    }

    // return console.log(updateHistoryMyGame)
    // console.log(updateHistoryMyGame)

    let body = JSON.stringify(updateHistoryMyPlatform);

    this.historyMyPlatformService.updateMyPlatform(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseMyPlatformUpdate:{ message:string, result:HistoryMyPlatformInterface}) => {
      if (reponseMyPlatformUpdate.message == "plateforme modifiée") {
        this.selectedMyPlatform = reponseMyPlatformUpdate.result;
        // console.log(reponseMyPlatformUpdate.result);

        if (this.app.myPlatformAll){
          const index = this.app.myPlatformAll.findIndex(item => item.myPlateform.id === reponseMyPlatformUpdate.result.myPlateform.id);
          if (index !== -1) {
            this.app.myPlatformAll[index] = reponseMyPlatformUpdate.result;
            // this.app.myPlatformAll[index].tempNote = reponseMyPlatformUpdate.result.rate.rating;
          }
        }

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
      this.isLoadingUpdate = false;
    }, (error) => {
      console.log('entré');
      this.isLoadingUpdate = false;
      Swal.fire({
        title: 'Erreur!',
        text: 'Échec de la mise à jour de votre jeux',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
      })
    })

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

  // deleteScreenshot(screenshot: HmgScreenshotInterface, index:number) {

  //   this.hmgScreenshotService.deleteScreenshot(screenshot.id, this.app.setURL(), this.app.createCorsToken()).subscribe((responseUploadScreenshot:{message:string}) => {
  //     if (responseUploadScreenshot.message == "good"){
  //      if (this.selectedMyPlatform){
  //        this.selectedMyPlatform.screenshot.splice(index, 1);
  //      }

  //       Swal.fire({
  //         title: 'Succès!',
  //         text: 'Votre screenshot à bien été supprimé.',
  //         icon: 'success',
  //         confirmButtonText: 'Ok',
  //         confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
  //       })

  //     } else {

  //       Swal.fire({
  //         title: 'Échec!',
  //         text: 'Échec de la suppresion de votre screenshot.',
  //         icon: 'error',
  //         confirmButtonText: 'Ok',
  //         confirmButtonColor: this.app.userConnected?.themeColor ||this.app.colorDefault
  //       })
  //     }
  //   }, (error) => { this.app.erreurSubcribe() })




  // }

  // onChangeScreenshot(newScreenshot:HmgScreenshotInterface){
  //   this.selectedMyPlatform?.screenshot.push(newScreenshot);
  // }

  /*
  *
  * END SCREENSHOT
  *
  * */



}