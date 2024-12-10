import {Component, Input, OnInit, Renderer2} from '@angular/core';
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
import Swal from "sweetalert2";
import {timeout} from "rxjs";
import {ViewService} from "../../-service/view.service";
import {ApicallInterface} from "../../-interface/apicall.interface";

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
  nbView: number | null = null;

  globalUrl:string = "";

  providerColor: string | undefined;

  isProviderFollowedByUser: boolean | undefined;
  idUser: number | undefined;
  providerId: number|any;
  providerSelected: ProviderInterface|undefined;

  followAll:FollowInterface[] = [];
  followAllParent:FollowInterface[] = [];



  constructor(
    private route: ActivatedRoute,
    private postActu: PostActuService,
    protected app: AppComponent,
    private commentService:CommentService,
    private followService:FollowService,
    private ipService: IpService,
    private likeService: LikeService,
    private renderer: Renderer2,
    private viewService:ViewService,
  ) {}

  ngOnInit(): void {

    this.actualityId = this.route.snapshot.paramMap.get('id');
    this.globalUrl = this.route.snapshot.url.join('/');

    this.getActuById(this.actualityId);

    this.getLikeByActu(this.actualityId);

    this.getCountByActu(this.actualityId);

    this.getViewsByActu(this.actualityId);

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
    // console.log(this.screenWidth);
  };


  getActuById(id: number): void {
    this.postActu.getPostActuById(id, this.app.setURL()).subscribe((response: { message: string; result: PostActuInterface }) => {
      if (response.message === "good") {
        this.actualitySelected = response.result;

        console.log('Fetched Actuality:', this.actualitySelected);

        if (this.actualitySelected) {
          this.addViewActu(this.actualitySelected.id);
          this.getProviderColor()
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
      Swal.fire({
        title: 'Attention!',
        text: 'Vous devez être connectez pour liké',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: this.app.colorDefault
      })
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

  // provider

  handleFollowed(providerId: number): void {
    console.log(`Provider followed with ID: ${providerId}`);
  }

  handleUnfollowed(providerId: number): void {
    console.log(`Provider unfollowed with ID: ${providerId}`);
  }


  verifFollowGameProfil(GameProfil: GameProfileInterface){
      // a faire
  }


  getCountByActu(id:number){

    this.commentService.getCountByActu(id, this.app.setURL()).subscribe(reponseMyCountActu => {
      if (reponseMyCountActu.message == "good") {

        this.nbCommentaire = reponseMyCountActu.result;

      }

    });

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

  getProviderColor(){
    this.providerColor = this.actualitySelected?.Provider?.color;
  }


  /* VIEW */
  addViewActu(id:number){
    setTimeout(() => {

      let bodyNoJson = {
        "id":id,
        "ip":"10.10.10.10"
      }

      let body = JSON.stringify(bodyNoJson);

      this.viewService.addActuView(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseAddViewActu:ApicallInterface) => {
        if (reponseAddViewActu.message == "good"){
          console.log("+1 vue");
        }
      })

    }, this.app.deadlineView);
  }

  getViewsByActu(idActu: number) {
    this.viewService.getPostActuViews(idActu, this.app.setURL()).subscribe(reponseViewByPostActu => {

      if (reponseViewByPostActu.message == "good"){

        this.nbView = reponseViewByPostActu.result;
      }
    })
  }

}
