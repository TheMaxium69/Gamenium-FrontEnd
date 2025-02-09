import {Component, Input} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'modal-view-myplatform',
  templateUrl: './view-myplatform.component.html',
  styleUrls: ['./view-myplatform.component.css']
})
export class ViewMyplatformComponent {

  @Input()
  isColor: string = this.app.colorDefault;

  constructor(protected app:AppComponent) { }




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

  closeModal(){

    const body = document.body;
    const shadow = document.getElementById('shadow');

    if (shadow) {


      shadow.remove(); // Remove the shadow div element from the DOM

      body.style.overflow = ''; // Re-enable scrolling by clearing the overflow style
      body.style.paddingRight = ''; // Clear paddingRight style
      body.classList.remove('modal-open'); // Remove 'modal-open' class

      const viewPlatformDiv = document.getElementById('viewPlatform');
      if (viewPlatformDiv) {
        viewPlatformDiv.classList.remove('show');
      }

    }

  }

}
