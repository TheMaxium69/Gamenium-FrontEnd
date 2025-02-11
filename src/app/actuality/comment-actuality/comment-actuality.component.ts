import {Component, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {NgForm, NgModel} from "@angular/forms";
import {CommentService} from "../../-service/comment.service";
import {CommentInterface} from "../../-interface/comment.interface";
import {BadgeService} from "../../-service/badge.service";
import {BadgeInterface} from "../../-interface/badge.interface";
import { ProfilInterface } from 'src/app/-interface/profil.interface';
import { ProfilService } from 'src/app/-service/profil.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LikeService } from 'src/app/-service/like.service';
import { LikeInterface } from 'src/app/-interface/like.interface';
import Swal from "sweetalert2";
import { empty } from 'rxjs';
import {CommentReplyInterface} from "../../-interface/comment-reply.interface";
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-comment-actuality',
  templateUrl: './comment-actuality.component.html',
  styleUrls: ['./comment-actuality.component.css']
})
export class CommentActualityComponent implements OnInit{

  userConnectedId:number|undefined;
  userColor : string | undefined;
  actualityId: string|any;
  actualitySelected: PostActuInterface|undefined;
  commentByActu: CommentInterface[]|undefined;
  badgeForAllUser: any[] = [];
  newComment : CommentInterface|undefined;
  profileInterface: ProfilInterface | undefined;
  commentLikedMap = new Map<number, boolean>();
  LikeAll: LikeInterface[]|undefined;
  nbLike: number | undefined = 0;
  sortDateOrLike: boolean = true;
  text: string = ""
  textLenght: number = 0;
  showReply: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private postActu: PostActuService,
    protected app: AppComponent,
    private commentService:CommentService,
    private badgeService:BadgeService,
    private renderer: Renderer2,
    private likeService: LikeService,
    private profileService: ProfilService,
  ) {}

  @Input()
  nbComment: number | undefined = 0;

  @Input()
  providerColor: string | undefined;

  @Output()
  commentNbChanged: EventEmitter<'add' | 'delete'> = new EventEmitter<'add' | 'delete'>()


  @Input()
  commentReplyAll: CommentReplyInterface[][] = [];


  ngOnInit(): void {

    if (this.app.isLoggedIn){

      this.userConnectedId = this.app.userConnected?.id;
      this.userColor = this.app.userConnected.themeColor

    }

    this.actualityId = this.route.snapshot.paramMap.get('id');

    this.getActuById(this.actualityId)

    this.getCommentWithActu(this.actualityId);

    this.getLikesOfUser()

  }

  getActuById(id:number){

    this.postActu.getPostActuById(id, this.app.setURL(), this.app.createCorsToken()).subscribe((reponsePostActu) => {

      if (reponsePostActu.message == "good"){

        this.actualitySelected = reponsePostActu.result

      }

    });
  }

  getLikesOfUser() {
    this.likeService.getLikesByUser(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseApi) => {

      if (reponseApi.message === 'good') {
        const likedComment = reponseApi.result.filter((like: any) => like.comment !== null);

        likedComment.forEach((like: any) => {
          if (like.comment?.id) {
            this.commentLikedMap.set(like.comment.id, true);
          }

        });

      }
    });

  }

  getLikeByComment(idComment: number) {

    this.likeService.getCommentLikes(idComment, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseLikeByCommentActu => {

      if (reponseLikeByCommentActu.message == 'good'){

        this.LikeAll = reponseLikeByCommentActu.result;

        this.nbLike = this.LikeAll?.length;

        const btnCommentLike = document.getElementById("like-value");
        this.LikeAll?.forEach((Like:LikeInterface) => {

          if (Like.user.id == this.userConnectedId && btnCommentLike){
            this.liked(btnCommentLike, "add")
          }

        })
      }
    })
  }

  getCommentWithActu(id:number){

    this.commentService.getCommentWithActu(id, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyCommentActu => {

      // console.log(reponseMyCommentActu)

      if (reponseMyCommentActu.message == "good") {

        this.commentByActu = reponseMyCommentActu.result;
        console.log(this.commentByActu)
        this.getBadgesForAllUsers();

        this.commentByActu?.forEach((oneComment:CommentInterface) => {
          this.getNBLikeByComment(oneComment.id);
        })

      } else {

        console.log(reponseMyCommentActu);

      }

    });



  }

  //empeche les retour a la ligne du bouton entrer
  preventTabulation(event: any) {
    event.preventDefault()
  }

  addComment(form: NgForm) {

    let dateHere = new Date()

    if (form.value) {
      let content = form.value['content'];
      //Verification que le message n'est pas vide ou plein d'espace
      if (content.trim() == "") {
        return console.log("Message invalide")
      }
      let bodyNoJsonMyCommentActu: any = {
        "id_post": this.actualitySelected?.id,
        "content": content,
      };

      const bodyMyCommentActu = JSON.stringify(bodyNoJsonMyCommentActu);
      console.log(bodyMyCommentActu)

      this.commentService.postCommentInActu(bodyMyCommentActu, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseMyCommentActuCreate:{message:string, result:CommentInterface }) => {
        if (reponseMyCommentActuCreate.message === "good") {
          this.newComment = reponseMyCommentActuCreate.result;
          console.log("Commentaire ajouté");


          if (this.commentByActu){
            this.commentByActu.push(this.newComment);
          } else {
            this.commentByActu = [];
            this.commentByActu.push(this.newComment);
          }

          this.nbLikeByComment[reponseMyCommentActuCreate.result.id] = 0;

          this.commentNbChanged.emit('add');
          const resetForm = form.resetForm();
          this.text = ''

          // Incrémente le nombre de commentaires après en avoir ajouté un.
          if (this.nbComment !== undefined) {
            this.nbComment++

            const commentHTML = document.querySelector('#comment-value')
            if (commentHTML) {
              commentHTML.textContent = this.nbComment.toString()
            }

            const noComment = document.querySelector('#no-comment') as HTMLElement
            if (this.nbComment > 0 && noComment) {
              noComment.style.display = 'none'
            }
          }

          this.userConnectedId = this.app.userConnected.id;
          console.log(reponseMyCommentActuCreate);
        }
      if (reponseMyCommentActuCreate.message === "to long content") {

        const textArea = document.querySelector('#BtnAddComment') as HTMLElement
        textArea.textContent = content;

        Swal.fire({
          title: 'Attention!',
          text: 'Le message ne doit pas dépasser 255 caractères.',
          icon: 'warning',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })

      }
      });
    }
  }


  getBadgesForAllUsers() {
    // Obtenez les badges pour chaque utilisateur et stockez-les dans badgeByUser
    if (this.commentByActu){

      this.commentByActu.forEach(comment => {
        this.badgeService.getBadgeByUser(comment.user.id, this.app.setURL(), this.app.createCorsToken()).subscribe((ReponseApi) => {
          if (ReponseApi.message == 'good') {
            this.badgeForAllUser[comment.user.id] = ReponseApi.result;
          }
        });
      });

    }

  }

  onDeleteBtnClick(commentId: number) {
    // console.log(commentId);

    Swal.fire({
      icon: "question",
      title: "Êtes-vous sûr?",
      text: "Souhaitez-vous vraiment supprimer ce commentaire ?",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteCommentInActu(commentId, this.app.setURL(), this.app.createCorsToken()).subscribe((ReponseApi) => {
          if (ReponseApi.message == 'Comment deleted successfully') {
            const borderToDelete = document.getElementById('b' + commentId)
            const commentToDelete = document.getElementById('c' + commentId)

            if (commentToDelete) {
              commentToDelete.style.display = 'none'
            }

            if (borderToDelete) {
              borderToDelete.style.display = 'none'
            }

            if (typeof this.nbComment == 'number' && this.nbComment > 0) {
              console.log(this.nbComment)
              this.nbComment--
              console.log(this.nbComment)

              const commentHTML = document.querySelector('#comment-value')
              if (commentHTML) {
                commentHTML.textContent = this.nbComment.toString()
              }

              const noComment = document.querySelector('#no-comment') as HTMLElement
              if (typeof this.nbComment == 'number' && this.nbComment == 0) {
                if (noComment !== null) {
                  noComment.style.display = 'block'
                } else {
                  const form = document.querySelector('#tempNoComment')
                  const commentSectionEmpty = this.renderer.createElement('h2');
                  this.renderer.setAttribute(commentSectionEmpty, 'id', 'no-comment');
                  commentSectionEmpty.textContent = 'Aucun commentaire';

                  this.renderer.appendChild(form, commentSectionEmpty)
                }
                console.log(noComment)
              }
            }

            this.commentNbChanged.emit('delete');
            console.log('message supprimé')
          } else {
            console.log('erreur ou pas de commentaire')

            Swal.fire({
              title: 'Echec!',
              text: 'Echec de la suppression du commentaire',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
            })
          }
        });
      }
    });

  }

  // replyToComment(commentId: number) {
  //   const replyForm = document.querySelector("#addReplyForm") as HTMLElement;
  //   replyForm.classList.remove('displayNone')
  //   replyForm.classList.add('display')
  // }

  likeComment(commentId: number, action: string) {
    if (action == 'add') {
      this.addLikeComment(commentId)
    } else if (action == 'delete') {
      this.deleteLikeComment(commentId)
    }
  }

  addLikeComment(commentId: number) {
    console.log(commentId)

    let bodyNoJson: any = {
      "id_comment": commentId
    }

    let bodyJson = JSON.stringify(bodyNoJson);

    this.likeService.addLikeComment(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseApi) => {
      if (reponseApi.message == 'good') {
        console.log('commentaire ' + commentId + ' liké par ' + this.userConnectedId)

        this.commentLikedMap.set(commentId, true);

        this.nbLikeByComment[commentId]++;

        /* SEULEMENT POUR CEUX QUI VIENNE DE CE FAIRE CREER*/
        let idByComment = 'like-value' + commentId
        let element = document.getElementById(idByComment)
        if (element){
          element.innerHTML = this.nbLikeByComment[commentId].toString()
        }

      } else if (reponseApi.message == "token is failed") {
        Swal.fire({
          title: 'Attention!',
          text: 'Vous devez être connectez pour liké',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      } else {
        Swal.fire({
          title: 'Echec!',
          text: 'Echec du j\'aime sur le commentaire',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }
    }, (error) => this.app.erreurSubcribe())

  }

  liked(btnCommentLike: HTMLElement, state: String) {

    if (state == "add"){

      if (this.actualitySelected?.Provider?.color){
        btnCommentLike.style.color = this.actualitySelected.Provider.color;
      } else {
        btnCommentLike.style.color = "red";
      }
      btnCommentLike.classList.remove("ri-heart-3-line");
      btnCommentLike.classList.add("ri-heart-3-fill");

    } else {

      btnCommentLike.style.color = "rgb(46, 58, 89)";
      btnCommentLike.classList.add("ri-heart-3-line");
      btnCommentLike.classList.remove("ri-heart-3-fill");

    }


  }

  deleteLikeComment(commentId: number) {
    console.log(commentId)
    let bodyNoJson: any = {
      "id_comment": commentId,
      "del": true
    }

    let bodyJson = JSON.stringify(bodyNoJson);

    this.likeService.addLikeComment(bodyJson, this.app.setURL(), this.app.createCorsToken()).subscribe(
      (reponseApi) => {
        if (reponseApi.message == 'good') {
          console.log('commentaire ' + commentId + ' plus liké par ' + this.userConnectedId)

          this.commentLikedMap.set(commentId, false);

          const likeIcon = document.querySelector('#like-icon'+commentId)
          this.renderer.removeClass(likeIcon, 'ri-heart-fill')
          this.renderer.addClass(likeIcon, 'ri-heart-line')
          this.renderer.setStyle(likeIcon,'color', 'rgb(87, 87, 87)')


          this.nbLikeByComment[commentId]--;

          /* SEULEMENT POUR CEUX QUI VIENNE DE CE FAIRE CREER*/
          let idByComment = 'like-value' + commentId
          let element = document.getElementById(idByComment)
          if (element){
            element.innerHTML = this.nbLikeByComment[commentId].toString()
          }

        } else {
          console.log('erreur dans la suppression du like du commentaire ' + commentId)
        }
      }, (error) => this.app.erreurSubcribe())

  }


  nbLikeByComment: number[] = []

  getNBLikeByComment(commentId: number): void {

    this.likeService.getCommentLikes(commentId, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseLikeByCommentActu: {message:string, result:LikeInterface[]}) => {

      if (reponseLikeByCommentActu.message == 'good'){
        this.nbLikeByComment[commentId] = reponseLikeByCommentActu.result.length;
      }

    })

  }

  isShortByDate:boolean = false;

  sortCommentByDate() {
    this.isShortByDate = true;

    //fonction trie par date
    this.commentByActu = this.commentByActu?.sort((a, b) => {
      const dateA = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;
      const dateB = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return dateB - dateA;
    });

  }

  sortCommentByLike() {
    this.isShortByDate = false;

    /* PAR LE PLUS LIKER */
    this.commentByActu?.sort((a, b) => (this.nbLikeByComment[b.id] || 0) - (this.nbLikeByComment[a.id] || 0));

  }

  getCommentLenght() {

    //recupere le textarea
      const charcount = document.querySelector('#CharCount') as HTMLElement

    //si ça dépasse le max le count vois rouge

      if (this.text.length > 255) {
        charcount.classList.add('red');
      } else {
        charcount.classList.remove('red');
      }

  }



  deleteCommentReply(commentReply: CommentReplyInterface, index:number){


    Swal.fire({
      icon: "question",
      title: "Êtes-vous sûr?",
      text: "Souhaitez-vous vraiment supprimer ce commentaire ?",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteCommentReply(commentReply.id, this.app.setURL(), this.app.createCorsToken()).subscribe(
          response => {
            if(response.message == "good"){
              this.commentReplyAll[commentReply.comment.id].splice(index, 1);
              // Swal.fire({
              //   title: 'Succès',
              //   text: 'Votre commentaire à bien été supprimé',
              //   icon: 'success',
              //   confirmButtonText: 'OK',
              //   confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
              // })
            } else {
              Swal.fire({
                title: 'Echec!',
                text: 'Echec de la suppression du commentaire',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
              })
            }
          },(error) => {this.app.erreurSubcribe()}
        )
      }
    });





  }

  addShowCommentReply(commentId: number) {
    const replyForm = document.querySelector(`#all-reply${commentId}`) as HTMLElement;
      replyForm.classList.remove('displayNone')
      replyForm.classList.add('display')
      this.showReply = true
  }

  removeShowCommentReply(commentId: number) {
    const replyForm = document.querySelector(`#all-reply${commentId}`) as HTMLElement;
    replyForm.classList.add('displayNone')
    replyForm.classList.remove('display')
      this.showReply = false
  }

  checkShowCommentReply(commentId: number) {
    if (this.showReply === false) {
      this.addShowCommentReply(commentId)
    } else {
      this.removeShowCommentReply(commentId)
    }
  }





  sendReplyComment(id_comment_main:number){
    let input:HTMLElement | null = document.getElementById('comment'+id_comment_main)

    if(input instanceof HTMLInputElement){
      let contentComment = input.value;

      if(contentComment.length <= 255) {
        if (contentComment.trim().length !== 0){

          let bodyNoJson = {
            "id_comment": id_comment_main,
            "content": contentComment
          }

          const body = JSON.stringify(bodyNoJson)

          this.commentService.postCommentReply(body, this.app.setURL(), this.app.createCorsToken()).subscribe((responseCommentReply: {message:string, result:CommentReplyInterface}) => {

            if(responseCommentReply.message == "good"){

              /* DYNAMIQUE */
              if (this.commentReplyAll[id_comment_main]){
                this.commentReplyAll[id_comment_main].push(responseCommentReply.result)
              } else {
                this.commentReplyAll[id_comment_main] = [responseCommentReply.result];
              }

              /* VIDER LE CHAMPS*/
              let input:HTMLElement | null = document.getElementById('comment'+id_comment_main)
              if(input instanceof HTMLInputElement){
                input.value = "";
              }

              // Swal.fire({
              //   title: 'Success',
              //   text: 'Votre commentaire à bien été ajouté',
              //   icon: 'success',
              //   confirmButtonText: 'OK',
              //   confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
              // })
            } else {
              Swal.fire({
                title: 'Echec!',
                text: 'Echec de l\'ajout du commentaire',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
              })
            }

          }, (error) => {this.app.erreurSubcribe()})

        } else {
          Swal.fire({
            title: 'Attention!',
            text: 'Votre commentaire doit faire au moins 1 caractère',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
          })
        }
      } else {
        // Trop long
        Swal.fire({
          title: 'Attention!',
          text: 'Votre commentaire doit faire 255 caractères maximum',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }

    } else {
      // il existe pas
      Swal.fire({
        title: 'Echec!',
        text: 'Echec de l\'ajout du commentaire',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
    }

  }


}
