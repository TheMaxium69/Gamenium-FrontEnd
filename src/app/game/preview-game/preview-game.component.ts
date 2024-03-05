import {Component, OnInit} from '@angular/core';
import {GameService} from "../../-service/game.service";
import {GameInterface} from "../../-interface/game.interface";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-preview-game',
  templateUrl: './preview-game.component.html',
  styleUrls: ['./preview-game.component.css']
})
export class PreviewGameComponent implements OnInit{

  gamePreview:GameInterface[]|any = [] ;

  constructor(private gameService:GameService, private app: AppComponent) {}


  ngOnInit(): void {

    this.getGamesWithLimit(1, 100);

  }

  getGamesWithLimit(page:number, limit:number): void {
    this.gameService.getGamesWithLimit(page, limit, this.app.setURL()).subscribe((responseApi) => {
      if (responseApi.message == "good"){

        if(this.gamePreview.length === 0){

          this.gamePreview = responseApi.result;

        } else {
          this.gamePreview = this.gamePreview.concat(responseApi.result);
          console.log(this.gamePreview.length)
          // this.gamePreview = this.gamePreview + responseApi.result;
        }


      } else {
        console.log(responseApi)
      }

    });
  }

}
