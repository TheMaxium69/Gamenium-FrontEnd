import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {DeviseInterface} from "../../-interface/devise.interface";
import {BuyWhereInterface} from "../../-interface/buy-where.interface";
import {DeviseService} from "../../-service/devise.service";
import {BuyWhereService} from "../../-service/buy-where.service";

@Component({
  selector: 'modal-add-game',
  templateUrl: './modal-add-game.component.html',
  styleUrls: ['./modal-add-game.component.css']
})
export class ModalAddGameComponent implements OnInit {

  constructor(protected app:AppComponent,
              private deviseService:DeviseService,
              private buyWhereService:BuyWhereService,) {}

  deviseAll:DeviseInterface[]|undefined;
  buyWhereAll:BuyWhereInterface[]|undefined;

  ngOnInit() {
    this.getAllInfo();
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

  }

}
