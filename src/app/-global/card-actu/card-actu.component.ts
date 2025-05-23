import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {LikeInterface} from "../../-interface/like.interface";
import {LikeService} from "../../-service/like.service";
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
              private commentService: CommentService) { }

  nbCountCom: number = 0;
  likeAll: number = 0;
  likedStatus: { [key: number]: boolean } = {};

  ngOnInit() {

    if (this.actu){
      this.getLikeByActu(this.actu.id) /* RECUPERE LES LIKES */
      this.getCountByActu(this.actu.id) /* RECUPERE LES COMS */
    }

  }

  /* RECUPERE TOUT LES LIKE ET SAVOIR SI TU A LIKE UNE ACTU */
  getLikeByActu(idActu: number) {
    this.likeService.getPostActuLikes(idActu, this.app.setURL(), this.app.createCorsToken()).subscribe(responseLikeByPostActu => {
      if (responseLikeByPostActu.message === 'good') {
        let isLiked = false;

        this.likeAll = responseLikeByPostActu.result.length;

        responseLikeByPostActu.result.forEach((like: LikeInterface) => {
          if (like.user.id === this.app.userConnected?.id) {
            isLiked = true;
          }
        });

        this.likedStatus[idActu] = isLiked;
      }
    });
  }

  /* RECUPERE TOUT LES COM DE L'ACTU */
  getCountByActu(id:number){
    this.commentService.getCountByActu(id, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseMyCountActu:{message:string, result: {
        total:number,
        reply:CommentInterface[],
      }}) => {
      if (reponseMyCountActu.message == "good") {
        this.nbCountCom = reponseMyCountActu.result.total;
      }
    });
  }

  /* AJOUTEZ UN LIKE */
  onClickLike(id: number) {
    const cardActuIcon = document.querySelector(`#likeIcon${id}`);

    if (!this.app.isLoggedIn) {
      Swal.fire({
        title: 'Attention!',
        text: 'Vous devez être connecté pour aimer',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
      return
      //console.log('Impossible de liker: User pas connecté')
    }

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
            this.likeAll--
          } else {
            this.liked(id, 'add');
            this.likedStatus[id] = true;
            this.likeAll++
          }
        }
      }
    }, (error) => this.app.erreurSubcribe());
  }

  /* GEREZ LE LIKE VISUELMENT */
  liked(id: number, state: string) {
    const cardActuIcon = document.querySelector(`#likeIcon${id}`) as HTMLElement

    if (state === 'add' && cardActuIcon) {
      if (this.actu) {
        cardActuIcon.style.color = this.actu.Provider?.color ? this.actu.Provider?.color : this.app.colorDefault;
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
