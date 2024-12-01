import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {LikeInterface} from "../../-interface/like.interface";
import {LikeService} from "../../-service/like.service";
import {IpService} from "../../-service/ip.service";
import Swal from "sweetalert2";
import {CommentInterface} from "../../-interface/comment.interface";
import {CommentService} from "../../-service/comment.service";

@Component({
  selector: 'app-card-actu',
  templateUrl: './card-actu.component.html',
  styleUrls: ['./card-actu.component.css']
})
export class CardActuComponent implements OnInit {

  @Input()
  public actu: PostActuInterface|null = null;

  constructor(protected app:AppComponent,
              private likeService:LikeService,
              private ipService: IpService,
              private commentService: CommentService) { }

  commentAll: CommentInterface[] = [];
  likeAll: LikeInterface[] = [];
  likedStatus: { [key: number]: boolean } = {};

  ngOnInit() {

    if (this.app.isLoggedIn && this.actu){
      this.getLikeByActu(this.actu.id) /* RECUPERE LES LIKES */
      this.getCommentWithActu(this.actu.id) /* RECUPERE LES COMS */
    }

  }

  /* RECUPERE TOUT LES LIKE ET SAVOIR SI TU A LIKE UNE ACTU */
  getLikeByActu(idActu: number) {
    this.likeService.getPostActuLikes(idActu, this.app.setURL()).subscribe(responseLikeByPostActu => {
      if (responseLikeByPostActu.message === 'good') {
        let isLiked = false;

        this.likeAll = responseLikeByPostActu.result;

        this.likeAll?.forEach((like: LikeInterface) => {
          if (like.user.id === this.app.userConnected?.id) {
            isLiked = true;
          }
        });

        this.likedStatus[idActu] = isLiked;
      }
    });
  }

  /* RECUPERE TOUT LES COM DE L'ACTU */
  getCommentWithActu(id:number){
    this.commentService.getCommentWithActu(id, this.app.setURL()).subscribe(reponseMyCommentActu => {
      if (reponseMyCommentActu.message == "good") {
        this.commentAll = reponseMyCommentActu.result;
      }
    });
  }

  /* AJOUTEZ UN LIKE */
  onClickLike(id: number) {
    const cardActuIcon = document.querySelector(`#likeIcon${id}`);

    if (!this.app.isLoggedIn) {
      Swal.fire({
        title: 'Attention!',
        text: 'Vous devez être connectez pour liké',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: this.app.colorDefault
      })
      return console.log('Impossible de liker: User pas connecté')
    }

    this.ipService.getMyIp(this.app.urlIp).subscribe(responseTyroIp => {
        let bodyNoJson: any = {
          id_postactu: id,
          ip: responseTyroIp.ip,
          del: true
        };

        let bodyJson = JSON.stringify(bodyNoJson);

        this.likeService.addLikePostActu(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(responseAddLikeByPostActu => {
            if (responseAddLikeByPostActu.message === 'good') {
              if (cardActuIcon) {
                if (responseAddLikeByPostActu.result === 'like is delete') {
                  this.liked(id, 'del');
                  this.likedStatus[id] = false;
                } else {
                  this.liked(id, 'add');
                  this.likedStatus[id] = true;
                }
              }
            }
          }, (error) => this.app.erreurSubcribe());
      }, error => {
        let bodyNoJson: any = {
          id_postactu: id,
          del: true
        };

        let bodyJson = JSON.stringify(bodyNoJson);

        this.likeService.addLikePostActu(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(responseAddLikeByPostActu => {
          if (responseAddLikeByPostActu.message === 'good') {
            if (cardActuIcon) {
              if (responseAddLikeByPostActu.result === 'like is delete') {
                this.liked(id, 'del');
                this.likedStatus[id] = false;
              } else {
                this.liked(id, 'add');
                this.likedStatus[id] = true;
              }
            }
          }
        }, (error) => this.app.erreurSubcribe());
      }
    );
  }

  /* GEREZ LE LIKE VISUELMENT */
  liked(id: number, state: string) {
    const cardActuIcon = document.querySelector(`#likeIcon${id}`) as HTMLElement

    if (state === 'add' && cardActuIcon) {
      if (this.actu) {
        cardActuIcon.style.color = this.actu.Provider?.color ? this.actu.Provider?.color : 'red';
      }
      cardActuIcon.classList.remove('ri-heart-line');
      cardActuIcon.classList.add('ri-heart-fill');
    } else if (state === 'del' && cardActuIcon) {
      cardActuIcon.style.color = '#2e3a59';
      cardActuIcon.classList.add('ri-heart-line');
      cardActuIcon.classList.remove('ri-heart-fill');
    }
  }



}
