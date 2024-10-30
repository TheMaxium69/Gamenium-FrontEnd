import {Component, OnInit} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {AppComponent} from "../../app.component";
import {PostActuService} from "../../-service/post-actu.service";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import { IpService } from 'src/app/-service/ip.service';
import { LikeService } from 'src/app/-service/like.service';
import { LikeInterface } from 'src/app/-interface/like.interface';

@Component({
  selector: 'app-card-actuality',
  templateUrl: './card-actuality.component.html',
  styleUrls: ['./card-actuality.component.css']
})
export class CardActualityComponent implements OnInit {

  isLogIn:boolean|undefined;
  userConnected:UserInterface|undefined;
  userConnectedId:number|undefined;
  postActuFollowOrAll:PostActuInterface[] = [];
  LikeAll: LikeInterface[]|undefined;

  constructor(private app:AppComponent,
    private ipService: IpService,
    private likeService: LikeService,
    private postActuService:PostActuService
  ) {}

  ngOnInit(): void {
    this.isLogIn = this.app.isLoggedIn;


    if (this.isLogIn){
      // Faire une recherche sur ces follow
      this.userConnectedId = this.app.userConnected.id;
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
      }

    });

  }

  getLikeByActu(idActu: number){

    this.likeService.getPostActuLikes(idActu, this.app.setURL()).subscribe(reponseLikeByPostActu => {

      if (reponseLikeByPostActu.message == "good"){ 

        this.LikeAll = reponseLikeByPostActu.result;

        this.LikeAll?.forEach((Like:LikeInterface) => {

          if (Like.user.id == this.userConnectedId){
            this.liked(idActu, "add")
          }

        })

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
                this.liked(id, "del");
                
              } else {
                this.liked(id, "add");
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

  liked(id: number, state: String) {
    const cardActuIcon = document.querySelector("#likeIcon"+id);

    if (state == "add" && cardActuIcon){
      cardActuIcon.classList.remove("ri-heart-line");
      cardActuIcon.classList.add("ri-heart-fill");

    } else if (state == "del" && cardActuIcon) {
      cardActuIcon.classList.add("ri-heart-line");
      cardActuIcon.classList.remove("ri-heart-fill");

    }
  }

}
