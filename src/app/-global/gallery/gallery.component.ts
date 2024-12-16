import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent{

  @Input()
  public index: number | null = null;

  @Input()
  public images: string[] | null = null

  arrow:number = 1;

  constructor(protected app:AppComponent) {}

  switch(next:boolean){

    if(next){

      if (this.images){
        let taillemax = this.images.length
        if (this.arrow == taillemax - 1){
          this.index = 1;
          this.arrow = 0;

        } else {
          this.arrow = this.arrow + 1;
        }

      }
    } else {

      if (this.images){
        let taillemax = this.images.length

        if (this.arrow == 1){
          this.arrow = taillemax;
        } else {

          this.arrow = this.arrow - 1;
        }




      }


    }

  }


}
