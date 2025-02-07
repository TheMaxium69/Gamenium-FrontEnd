import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ProfilService} from "../../-service/profil.service";
import {ProfilInterface} from "../../-interface/profil.interface";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";

@Component({
  selector: 'modal-view-mygame',
  templateUrl: './view-mygame.component.html',
  styleUrls: ['./view-mygame.component.css']
})
export class ViewMygameComponent {

  constructor(
    protected app:AppComponent) {}

  @Input()
  isColor: string = this.app.colorDefault;

  profilSelected: ProfilInterface | undefined;




  showReview:boolean = false
  toggleShowReview(){
    this.showReview = !this.showReview;
  }
  showContent:boolean = false
  toggleShowContent(){
    this.showContent = !this.showContent;
  }

  showPurchaseContent:boolean = false
  toggleShowPurchaseContent(){
    this.showPurchaseContent = !this.showPurchaseContent;
  }

  showCopyContent:number[] = []
  toggleShowCopyContent(copyId:number){
    const index = this.showCopyContent.indexOf(copyId);
    if (index > -1) {
      this.showCopyContent.splice(index, 1);
    } else {
      this.showCopyContent.push(copyId);
    }
  }
  isShowCopyContent(copyId:number): boolean {
    return this.showCopyContent.includes(copyId);
  }


  showCopyPurchaseContent:number[] = []
  toggleShowCopyPurchaseContent(copyId:number){
    const index = this.showCopyPurchaseContent.indexOf(copyId);
    if (index > -1) {
      this.showCopyPurchaseContent.splice(index, 1);
    } else {
      this.showCopyPurchaseContent.push(copyId);
    }
  }
  isShowCopyPurchaseContent(copyId:number): boolean {
    return this.showCopyPurchaseContent.includes(copyId);
  }

  deleteMyGame(myGameHistorique: HistoryMyGameInterface | undefined){

    this.app.deleteMyGame(myGameHistorique);
    this.closeModal();

  }

  closeModal(){

    const body = document.body;
    const shadow = document.getElementById('shadow');

    if (shadow) {


      shadow.remove(); // Remove the shadow div element from the DOM

      body.style.overflow = ''; // Re-enable scrolling by clearing the overflow style
      body.style.paddingRight = ''; // Clear paddingRight style
      body.classList.remove('modal-open'); // Remove 'modal-open' class

      const viewGameDiv = document.getElementById('viewGame');
      if (viewGameDiv) {
        viewGameDiv.classList.remove('show');
      }

    }

  }

}
