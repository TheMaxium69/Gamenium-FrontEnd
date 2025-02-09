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
