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
    private app: AppComponent,
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

    this.getCommentWithActu(this.actualityId);

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn){

      this.userConnectedId = this.app.userConnected.id;

    }

    // if (this.idUser) {
    //   this.checkIfUserFollowProvider(this.idUser)
    //   console.log(this.isProviderFollowedByUser)
    // }

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

  // checkIfUserFollowProvider(userId: number) {
  //   this.providerId = this.route.snapshot.paramMap.get('id')

  //   this.followService.getFollowByProvider(this.providerId, this.app.setURL()).subscribe((reponseApi) => {
  //     if (reponseApi.message == 'good') {
  //       this.isProviderFollowedByUser = reponseApi.result.some((result: any) => result.user.id == userId)
  //     } else {
  //       this.isProviderFollowedByUser = false
  //     }
  //   })
  // }

  getActuById(id:number){

    this.postActu.getPostActuById(id, this.app.setURL()).subscribe((reponsePostActu:{message:string,result:PostActuInterface}) => {

      if (reponsePostActu.message == "good"){

        this.actualitySelected = reponsePostActu.result
        this.getProviderColor();

        console.log(this.actualitySelected)

        if (this.isLoggedIn) {
          if (this.actualitySelected?.Provider) {
            this.verifFollowProvider(this.actualitySelected?.Provider)
          }
          if (this.actualitySelected?.Provider?.parentCompany) {
            this.verifFollowParentProvider(this.actualitySelected?.Provider?.parentCompany)
          }
          if (this.actualitySelected?.GameProfile) {
            this.verifFollowGameProfil(this.actualitySelected?.GameProfile)
          }
        }

        if (this.actualitySelected){
          this.addViewActu(this.actualitySelected.id)
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

  verifFollowProvider(Provider: ProviderInterface){
    let btnFollowProvider:HTMLElement|null;

    this.followService.getFollowByProvider(Provider.id, this.app.setURL()).subscribe(reponseFollowByProvider => {

      if (reponseFollowByProvider.message == "good") {

        this.followAll = reponseFollowByProvider.result;
        this.followAll.forEach((followOne:FollowInterface)=>{
          if (followOne.user.id == this.userConnectedId){

            btnFollowProvider = document.getElementById("followBtn"+Provider.id)
            if (btnFollowProvider){
              btnFollowProvider.innerText = 'Suivie';
            }

          } else {
            btnFollowProvider = document.getElementById("followBtn"+Provider.id)
            if (btnFollowProvider){
              btnFollowProvider.innerText = 'Suivre';
            }

          }

        });

      }
      console.table(this.followAll)

    });

  }

  verifFollowParentProvider(Provider: ProviderInterface){
    let btnFollowProvider:HTMLElement|null;

    this.followService.getFollowByProvider(Provider.id, this.app.setURL()).subscribe(reponseFollowByProvider => {

      if (reponseFollowByProvider.message == "good") {

        this.followAllParent = reponseFollowByProvider.result;
        this.followAllParent.forEach((followOne:FollowInterface)=>{
          if (followOne.user.id == this.userConnectedId){

            btnFollowProvider = document.getElementById("followBtn"+Provider.id)
            if (btnFollowProvider){

              btnFollowProvider.innerText = 'Suivie';

            }

          } else {

            btnFollowProvider = document.getElementById("followBtn"+Provider.id)
            if (btnFollowProvider){

              btnFollowProvider.innerText = 'Suivre';

            }
          }

        });

      }
      console.table(this.followAll)

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

  followBtnClickParent(providerId: number | undefined) {
    if (providerId) {
      const btn = document.querySelector('#followBtn' + providerId) as HTMLElement
      const provider = this.followAllParent.find((follow: FollowInterface) => follow.provider?.id === providerId && follow.user.id === this.userConnectedId )

      if (provider) {
        this.deleteFollow(providerId)
        btn.textContent = 'Suivre'
      } else {
        this.followProviderUs(providerId)
        btn.textContent = 'Suivie'
      }
    }

  }

  followBtnClick(providerId: number | undefined) {
    if (providerId) {
      const btn = document.querySelector('#followBtn' + providerId) as HTMLElement
      const provider = this.followAll.find((follow: FollowInterface) => follow.provider?.id === providerId && follow.user.id === this.userConnectedId )

      if (provider) {
        this.deleteFollow(providerId)
        btn.textContent = 'Suivre'
      } else {
        this.followProviderUs(providerId)
        btn.textContent = 'Suivie'
      }
    }

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

          if (reponseAddFollow.message === "good") {
            const addedFollow: FollowInterface = reponseAddFollow.result;
            console.log(addedFollow)
            this.followAll.push(addedFollow);
            this.followAllParent.push(addedFollow);

            console.log("Follow ajouté pour le provider: " + id);
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
            btnFollowProvider = document.getElementById("button-follow-text"+id)
            if (btnFollowProvider){

              btnFollowProvider.innerText = 'Suivie';

            }
          }
        });
      });
  }

  deleteFollow(providerId: number) {
    console.log('delete clicked')

    this.followService.deleteFollowProvider(providerId, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseApi) => {

      if (reponseApi.message === "follow deleted successfully") {

        this.followAll = this.followAll.filter((follow) =>
          follow.provider?.id !== providerId &&
          follow.user.id === this.userConnectedId
        );

        this.followAllParent = this.followAllParent.filter((follow) =>
          follow.provider?.id !== providerId &&
          follow.user.id === this.userConnectedId
        );



        // this.followAllParent = this.followAllParent.filter((follow) =>
        //   follow.provider?.parentCompany.id !== providerId &&
        //   follow.user.id === this.userConnectedId
        // );

        console.log("Follow supprimé pour le provider: " + providerId);

      }
    })

  }

  followBtnMouseEnter(id: number|undefined) {
    // console.log('mouse enter')
    // const btnTxt = document.querySelector('#button-follow-text'+id) as HTMLElement
    // const plusI = this.renderer.createElement('i')
    // this.renderer.addClass(plusI, 'ri-add-circle-line')
    // this.renderer.appendChild(btnTxt, plusI)
    // if (btnTxt && this.isProviderFollowedByUser) {
    //   btnTxt.textContent = 'Ne plus suivre'
    //   btnTxt.style.backgroundColor = 'white'
    //   btnTxt.style.color = this.providerSelected?.color ?? 'red'
    //   btnTxt.style.border = '2px solid'
    //   btnTxt.style.borderColor = this.providerSelected?.color ?? 'red'
    //   btnTxt.style.transition = 'all 0.2s ease';
    // }
  }

  followBtnMouseLeave(id: number|undefined) {
    // console.log('mouse leave')
    // const btnTxt = document.querySelector('#button-follow-text'+id) as HTMLElement
    // const plusI = this.renderer.createElement('i')
    // this.renderer.addClass(plusI, 'ri-add-circle-line')
    // this.renderer.appendChild(btnTxt, plusI)
    // if (btnTxt) {
    //   btnTxt.textContent = this.isProviderFollowedByUser ? 'Suivie' : 'Suivre'
    //   btnTxt.style.backgroundColor = this.providerSelected?.color ?? 'red'
    //   btnTxt.style.color = 'white'
    //   btnTxt.style.border = 'none'
    //   btnTxt.style.transition = 'all 0.2s ease';
    // }
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

    }, 2000);
  }

}
