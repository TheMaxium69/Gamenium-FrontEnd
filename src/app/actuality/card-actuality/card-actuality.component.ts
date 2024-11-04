import {Component, OnInit} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {AppComponent} from "../../app.component";
import {PostActuService} from "../../-service/post-actu.service";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import { IpService } from 'src/app/-service/ip.service';
import { LikeService } from 'src/app/-service/like.service';
import { LikeInterface } from 'src/app/-interface/like.interface';
import { ActivatedRoute, Router } from '@angular/router';

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
  postByProvider:PostActuInterface[] = [];
  LikeAll: LikeInterface[]|undefined;
  providerId: number | undefined;

  likedStatus: { [key: number]: boolean } = {};

  constructor(
    private app:AppComponent,
    private ipService: IpService,
    private likeService: LikeService,
    private postActuService:PostActuService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLogIn = this.app.isLoggedIn;

    if (this.router.url.includes('provider')) {
      this.route.paramMap.subscribe(params => {
        this.providerId = Number(params.get('id'))
      })

      if (typeof this.providerId == 'number') {
        return this.getPostByProvider(this.providerId)
      }
    }

    if (this.isLogIn){
      // Faire une recherche sur ces follow
      this.userConnectedId = this.app.userConnected.id;
      this.userConnected = this.app.userConnected;

      if (this.userConnected?.id){
        this.followActuByUser(this.userConnected.id);
      }

      if (this.router.url.includes('provider')) {
        this.route.paramMap.subscribe(params => {
          this.providerId = Number(params.get('id'))
        })

        if (typeof this.providerId == 'number') {
          return this.getPostByProvider(this.providerId)
        }
      }
    
    } else if (this.postActuFollowOrAll.length == 0) {
      this.getActuAll()
    }

  }

  followActuByUser(id: number){

    console.log("recupere les follows")

    if (!this.router.url.includes('provider')) {
      this.getActuAll();
    }
    
  }
  
  getActuAll(){
    console.log('get actu all')
    this.postActuService.getActuAll(this.app.setURL()).subscribe((responseActu) => {
      console.log(responseActu);
      
      if (responseActu.message == "good"){
        this.postActuFollowOrAll = responseActu.result;
        console.log(this.postActuFollowOrAll)
        this.postActuFollowOrAll.forEach((actu: any) => {
          this.getLikeByActu(actu.id);
        });
      }

    });

  }

  getPostByProvider(id: number) {
    console.log('get post by provider')
    this.postActuService.getPostByProvider(id, this.app.setURL()).subscribe((response) => {
      console.log(response);

      if (response.message === "good") {
        this.postActuFollowOrAll = response.result;
        console.log(this.postByProvider);
        this.postActuFollowOrAll.forEach((actu: any )=> {
          this.getLikeByActu(actu.id)
        });
      }

    })
  }

  getLikeByActu(idActu: number) {
    this.likeService.getPostActuLikes(idActu, this.app.setURL()).subscribe(reponseLikeByPostActu => {
      if (reponseLikeByPostActu.message === "good") {
        let isLiked = false;
  
        this.LikeAll = reponseLikeByPostActu.result;

        this.LikeAll?.forEach((like: LikeInterface) => {
          if (like.user.id === this.userConnectedId) {
            isLiked = true;
          }
        });
  
        this.likedStatus[idActu] = isLiked;
      }
    });
  }
  
  onClickLike(id: number){
    const cardActuIcon = document.querySelector(`#likeIcon${id}`);

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

          if (cardActuIcon) {

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
    const cardActuIcon = document.querySelector(`#likeIcon${id}`);

    if (state == "add" && cardActuIcon){
      cardActuIcon.classList.remove("ri-heart-line");
      cardActuIcon.classList.add("ri-heart-fill");

    } else if (state == "del" && cardActuIcon) {
      cardActuIcon.classList.add("ri-heart-line");
      cardActuIcon.classList.remove("ri-heart-fill");

    }
  }



}
