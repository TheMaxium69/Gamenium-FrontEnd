import {Component, OnInit} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {AppComponent} from "../../app.component";
import {PostActuService} from "../../-service/post-actu.service";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import { IpService } from 'src/app/-service/ip.service';
import { LikeService } from 'src/app/-service/like.service';

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
    private ipService: IpService,
    private likeService: LikeService,
    private postActuService:PostActuService
  ) {}

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

    this.getActuAll();
    
  }
  
  getActuAll(){
    
    this.postActuService.getActuAll(this.app.setURL()).subscribe((responseActu) => {
      console.log(responseActu);
      
      if (responseActu.message == "good"){
        this.postActuFollowOrAll = responseActu.result;
        console.log(this.postActuFollowOrAll)
      }


    });

  }

  onClickLike(id: number){
    const cardActuLike = document.querySelector(".cardActuLike");
    console.log(cardActuLike)

    this.ipService.getMyIp(this.app.urlIp).subscribe(reponseTyroIp => {


      let bodyNoJson: any = {
        "id_postactu": id,
        "ip": reponseTyroIp.ip,
        "del": true
      }

      let bodyJson = JSON.stringify(bodyNoJson);

      this.likeService.addLikePostActu(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseAddLikeByPostActu => {

        console.log(reponseAddLikeByPostActu);

        if (reponseAddLikeByPostActu.message == "good"){

          if (cardActuLike) {

            if (reponseAddLikeByPostActu.result == "like is delete"){
                cardActuLike.classList.add("ri-heart-line");
                cardActuLike.classList.remove("ri-heart-fill");
                
              } else {
                cardActuLike.classList.remove("ri-heart-line");
                cardActuLike.classList.add("ri-heart-fill");
              }
          }
        }

      });

    },
    (error) => {

      let bodyNoJson: any = {
        "id_postactu": id,
        "del": true
      }

      let bodyJson = JSON.stringify(bodyNoJson);

      this.likeService.addLikePostActu(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseAddLikeByPostActu => {

        console.log(reponseAddLikeByPostActu);

        if (reponseAddLikeByPostActu.message == "good"){


        }

      });

    });

  }

//   liked(cardActuLike: HTMLElement, state: String) {

//     if (state == "add"){

//       if (this.actualitySelected?.Provider?.color){
//         cardActuLike.style.color = this.actualitySelected.Provider.color;
//       } else {
//         cardActuLike.style.color = "red";
//       }
//       cardActuLike.classList.remove("ri-heart-3-line");
//       cardActuLike.classList.add("ri-heart-3-fill");

//     } else {

//       cardActuLike.style.color = "rgb(46, 58, 89)";
//       cardActuLike.classList.add("ri-heart-3-line");
//       cardActuLike.classList.remove("ri-heart-3-fill");

//     }
//   }

// }


}
