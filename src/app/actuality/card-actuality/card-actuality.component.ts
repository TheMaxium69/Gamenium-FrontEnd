import {Component, OnInit} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {AppComponent} from "../../app.component";
import {PostActuService} from "../../-service/post-actu.service";
import {PostActuInterface} from "../../-interface/post-actu.interface";

@Component({
  selector: 'app-card-actuality',
  templateUrl: './card-actuality.component.html',
  styleUrls: ['./card-actuality.component.css']
})
export class CardActualityComponent implements OnInit {

  isLogIn:boolean|undefined;
  userConnected:UserInterface|undefined;
  postActuFollowOrAll:PostActuInterface[] = [];

  constructor(private app:AppComponent,
              private postActuService:PostActuService) {}

  ngOnInit(): void {
    this.isLogIn = this.app.isLoggedIn;

    if (this.isLogIn){
      // Faire une recherche sur ces follow
      this.userConnected = this.app.userConnected;

      if (this.userConnected?.id){
        this.followActuByUser(this.userConnected.id);
      }

    } else {

      this.getActuAll()
    }

  }

  followActuByUser(id: number){

    console.log("recupere les follows")

  }

  getActuAll(){

    this.postActuService.getActuAll(this.app.setURL()).subscribe((responseActu) => {
      // console.log(responseActu);

      if (responseActu.message == "good"){
        this.postActuFollowOrAll = responseActu.result;
      }


    });

  }

}
