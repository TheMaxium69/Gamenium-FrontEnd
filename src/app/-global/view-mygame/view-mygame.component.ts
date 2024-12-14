import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ProfilService} from "../../-service/profil.service";
import {ProfilInterface} from "../../-interface/profil.interface";

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

}
