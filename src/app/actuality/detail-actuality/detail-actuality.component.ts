import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {CommentService} from "../../-service/comment.service";
import {ProviderInterface} from "../../-interface/provider.interface";
import {GameProfileInterface} from "../../-interface/game-profile.interface";
import {FollowService} from "../../-service/follow.service";
import {FollowInterface} from "../../-interface/follow.interface";
import {BadgeInterface} from "../../-interface/badge.interface";
import {IpService} from "../../-service/ip.service";
import {LikeService} from "../../-service/like.service";
import {LikeInterface} from "../../-interface/like.interface";

@Component({
  selector: 'app-detail-actuality',
  templateUrl: './detail-actuality.component.html',
  styleUrls: ['./detail-actuality.component.css']
})
export class DetailActualityComponent implements OnInit{

  isLoggedIn:boolean = false;
  userConnectedId:number|undefined;

  actualityId: string|any;
  actualitySelected: PostActuInterface|undefined;
  noneActu: boolean = false;

  LikeAll: LikeInterface[]|undefined;
  nbLike:number | undefined = 0;
  nbCommentaire:number = 0;
  screenWidth: number = window.innerWidth;

  globalUrl:string = "";

  constructor(private route: ActivatedRoute,
              private postActu: PostActuService,
              private app: AppComponent,
              private commentService:CommentService,
              private followService:FollowService,
              private ipService: IpService,
              private likeService: LikeService) {}

  ngOnInit(): void {



    this.actualityId = this.route.snapshot.paramMap.get('id');
    this.globalUrl = this.route.snapshot.url.join('/');

    this.getActuById(this.actualityId);

    this.getLikeByActu(this.actualityId);

    this.getCommentWithActu(this.actualityId);

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn){

      this.userConnectedId = this.app.userConnected.id;

    }

    this.updateScreenWidth();

    window.addEventListener('resize', this.updateScreenWidth)

  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateScreenWidth);
  }

  updateScreenWidth = (): void => {
    this.screenWidth = window.innerWidth;
    console.log(this.screenWidth);
  };

  getActuById(id:number){

    this.postActu.getPostActuById(id, this.app.setURL()).subscribe((reponsePostActu) => {

      if (reponsePostActu.message == "good"){

        this.actualitySelected = reponsePostActu.result

        console.log(this.actualitySelected)

        if (this.isLoggedIn) {
          if (this.actualitySelected?.Provider) {
            this.verifFollowProvider(this.actualitySelected?.Provider)
          }
          if (this.actualitySelected?.Provider?.parentCompany) {
            this.verifFollowProvider(this.actualitySelected?.Provider?.parentCompany)
          }
          if (this.actualitySelected?.GameProfile) {
            this.verifFollowGameProfil(this.actualitySelected?.GameProfile)
          }
        }

      } else {

        this.noneActu = true;

      }


    });
  }

  getLikeByActu(idActu: number){

    this.likeService.getPostActuLikes(idActu, this.app.setURL()).subscribe(reponseLikeByPostActu => {

      if (reponseLikeByPostActu.message == "good"){

        this.LikeAll = reponseLikeByPostActu.result;

        this.nbLike = this.LikeAll?.length;

        const btnActuLike = document.getElementById("actulike");
        this.LikeAll?.forEach((Like:LikeInterface) => {

          if (Like.user.id == this.userConnectedId && btnActuLike){
            this.liked(btnActuLike, "add")
          }

        })

      }

    });


  }


  addLikeByActu(){

    if (!this.isLoggedIn) {
      return console.log('Vous devez etre connecté pour liker')
    }

    const btnActuLike = document.getElementById("actulike");

    this.ipService.getMyIp(this.app.urlIp).subscribe(reponseTyroIp => {


              let bodyNoJson: any = {
                "id_postactu": this.actualityId,
                "ip": reponseTyroIp.ip,
                "del": true
              }

              let bodyJson = JSON.stringify(bodyNoJson);

              this.likeService.addLikePostActu(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseAddLikeByPostActu => {

                console.log(reponseAddLikeByPostActu);

                if (reponseAddLikeByPostActu.message == "good"){

                  if (reponseAddLikeByPostActu.result == "like is delete"){

                    /*RETIRER LE LIKE*/
                    if (this.nbLike){
                      this.nbLike -= 1;
                    }

                    if (btnActuLike){
                      this.liked(btnActuLike, "del")
                    }

                  } else {

                    /*AJOTUER LE LIKE*/
                    if (this.nbLike){
                      this.nbLike += 1;
                    } else {
                      this.nbLike = 1;
                    }

                    if (btnActuLike){
                      this.liked(btnActuLike, "add")
                    }

                  }


                }

              });

      },
      (error) => {

              let bodyNoJson: any = {
                "id_postactu": this.actualityId,
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

  verifFollowProvider(Provider: ProviderInterface){

    let followAll:FollowInterface[] = [];
    let btnFollowProvider:HTMLElement|null;

    this.followService.getFollowByProvider(Provider.id, this.app.setURL()).subscribe(reponseFollowByProvider => {

      if (reponseFollowByProvider.message == "good") {

        followAll = reponseFollowByProvider.result;

        followAll.forEach((followOne:FollowInterface)=>{

          if (followOne.user.id == this.userConnectedId){

            btnFollowProvider = document.getElementById("followBtn"+Provider.id)
            if (btnFollowProvider){

              btnFollowProvider.innerText = 'Suivie';

            }

          }

        });

      }

    });

  }

  verifFollowGameProfil(GameProfil: GameProfileInterface){
      // a faire
  }


  getCommentWithActu(id:number){

    this.commentService.getCommentWithActu(id, this.app.setURL()).subscribe(reponseMyCommentActu => {
      if (reponseMyCommentActu.message == "good") {

        this.nbCommentaire = reponseMyCommentActu.result.length;

      }

    });

  }

  followProviderUs(id: number|undefined) {

    if (!id){
      return;
    }

    let btnFollowProvider:HTMLElement|null;
    this.ipService.getMyIp(this.app.urlIp).subscribe(reponseTyroIp => {

        let bodyNoJsonAddFollow: any = {
          "id_provider": id,
          "ip": reponseTyroIp.ip,
        };

        const bodyAddFollow = JSON.stringify(bodyNoJsonAddFollow);

        this.followService.postFollowProvider(bodyAddFollow, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseAddFollow => {

          if (reponseAddFollow.message == "good"){

            btnFollowProvider = document.getElementById("followBtn"+id)
            if (btnFollowProvider){

              btnFollowProvider.innerText = 'Suivie';

            }

          }

        });


      },
      (error) => {

        console.error("TyroIp : ", error);

        let bodyNoJsonAddFollow: any = {
          "id_provider": id
        };

        const bodyAddFollow = JSON.stringify(bodyNoJsonAddFollow);

        this.followService.postFollowProvider(bodyAddFollow, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseAddFollow => {

          if (reponseAddFollow.message == "good"){

            btnFollowProvider = document.getElementById("followBtn"+id)
            if (btnFollowProvider){

              btnFollowProvider.innerText = 'Suivie';

            }

          }

        });



      });





  }

  unfollowUs(id: number | undefined) {

    console.log("unfollow")

  }

  liked(btnActuLike: HTMLElement, state: String) {

    if (state == "add"){

      if (this.actualitySelected?.Provider?.color){
        btnActuLike.style.color = this.actualitySelected.Provider.color;
      } else {
        btnActuLike.style.color = "red";
      }
      btnActuLike.classList.remove("ri-heart-3-line");
      btnActuLike.classList.add("ri-heart-3-fill");

    } else {

      btnActuLike.style.color = "rgb(46, 58, 89)";
      btnActuLike.classList.add("ri-heart-3-line");
      btnActuLike.classList.remove("ri-heart-3-fill");

    }


  }

  updateNbComment(event: string) {
    if (event == 'add') {
      this.nbCommentaire++
    }

    if (event == 'delete') {
      this.nbCommentaire--
    }

  }

  redirectComment(){
    window.location.href = this.globalUrl + '#commentSection';
  }

}
