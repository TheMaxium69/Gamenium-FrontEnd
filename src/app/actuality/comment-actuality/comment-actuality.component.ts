import {Component, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {NgForm} from "@angular/forms";
import {CommentService} from "../../-service/comment.service";
import {CommentInterface} from "../../-interface/comment.interface";
import {BadgeService} from "../../-service/badge.service";
import {BadgeInterface} from "../../-interface/badge.interface";
import { ProfilInterface } from 'src/app/-interface/profil.interface';
import { ProfilService } from 'src/app/-service/profil.service';

@Component({
  selector: 'app-comment-actuality',
  templateUrl: './comment-actuality.component.html',
  styleUrls: ['./comment-actuality.component.css']
})
export class CommentActualityComponent implements OnInit{

  isLoggedIn:boolean = false;
  userConnectedId:number|undefined;
  userColor : string | undefined;
  actualityId: string|any;
  actualitySelected: PostActuInterface|undefined;
  commentByActu: CommentInterface[]|undefined;
  badgeForAllUser: any[] = [];
  newComment : CommentInterface|undefined;
  profileInterface: ProfilInterface | undefined;

  constructor(
    private route: ActivatedRoute,
    private postActu: PostActuService,
    private app: AppComponent,
    private commentService:CommentService,
    private badgeService:BadgeService,
    private renderer: Renderer2,
    private profileService: ProfilService
  ) {}

  @Input()
  nbComment: number | undefined = 0;

  @Output()
  commentNbChanged: EventEmitter<'add' | 'delete'> = new EventEmitter<'add' | 'delete'>()

  
  ngOnInit(): void {

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn){

      this.userConnectedId = this.app.userConnected.id;
      this.userColor = this.app.userConnected.themeColor

    }

    this.actualityId = this.route.snapshot.paramMap.get('id');

    this.getActuById(this.actualityId)

    this.getCommentWithActu(this.actualityId);

  }

  getActuById(id:number){

    this.postActu.getPostActuById(id, this.app.setURL()).subscribe((reponsePostActu) => {

      if (reponsePostActu.message == "good"){

        this.actualitySelected = reponsePostActu.result

      }

    });
  }

  getCommentWithActu(id:number){

    this.commentService.getCommentWithActu(id, this.app.setURL()).subscribe(reponseMyCommentActu => {

      // console.log(reponseMyCommentActu)

      if (reponseMyCommentActu.message == "good") {

        this.commentByActu = reponseMyCommentActu.result;

        this.getBadgesForAllUsers();

      } else {

        console.log(reponseMyCommentActu);

      }

    });



  }


  addComment(form: NgForm) {
    if (form.value) {
      let content = form.value['content'];
  
      let bodyNoJsonMyCommentActu: any = {
        "id_post": this.actualitySelected?.id,
        "content": content,
      };
  
      const bodyMyCommentActu = JSON.stringify(bodyNoJsonMyCommentActu);
      
      const resetForm = form.resetForm();

  
      this.commentService.postCommentInActu(bodyMyCommentActu, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyCommentActuCreate => {
        if (reponseMyCommentActuCreate.message === "good") {
          this.newComment = reponseMyCommentActuCreate.result;
  
          console.log("Commentaire ajouté");

          
          let noteSpanGame = document.getElementById("yourComment");
          if (noteSpanGame && this.newComment) {

            const commentCard = this.renderer.createElement('div');
            this.renderer.setAttribute(commentCard, 'id', `c${this.newComment.id}`);
            this.renderer.addClass(commentCard, 'card');
            this.renderer.addClass(commentCard, 'mb-2');
            

            const commentUser = this.renderer.createElement('div');
            this.renderer.addClass(commentUser, 'comment-user');
  
            // Si pas de photo de profile 
            if (this.newComment.user.pp?.url) {
              const profilePicture = this.renderer.createElement('div');
              this.renderer.addClass(profilePicture, 'img');
              this.renderer.setStyle(profilePicture, 'background-image', `url('${this.newComment.user.pp.url}')`);
              
              this.renderer.appendChild(commentUser, profilePicture);
            } else {
              const initialContainer = this.renderer.createElement('div');
              this.renderer.addClass(initialContainer, 'align-content-center');
              this.renderer.addClass(initialContainer, 'lettrePP-border');
              this.renderer.setStyle(initialContainer, 'border-color', this.newComment.user.color);
  
              const initialText = this.renderer.createElement('p');
              this.renderer.addClass(initialText, 'lettrePP');
              this.renderer.setStyle(initialText, 'color', this.newComment.user.color);
              this.renderer.setProperty(initialText, 'textContent', this.newComment.user.displayname.charAt(0).toUpperCase());
              
              this.renderer.appendChild(initialContainer, initialText);
              this.renderer.appendChild(commentUser, initialContainer);
            }
  
            // Ajout de la div username
            const userName = this.renderer.createElement('h4');
            this.renderer.addClass(userName, 'comment-user-name');
            const nameHTML = `(Vous) <span style="color:${this.newComment.user.color}">${this.newComment.user.displayname}</span>`;
            this.renderer.setProperty(userName, 'innerHTML', nameHTML);

            this.renderer.appendChild(commentUser, userName);

            // Badges de l'user
            const badges = this.badgeForAllUser[this.newComment.user.id];
            if (badges) {
              badges.forEach((badgeData: BadgeInterface) => {
                const badgeImg = this.renderer.createElement('img');
                this.renderer.addClass(badgeImg, 'badgeIMG');

                if (badgeData.picture?.url) {
                  this.renderer.setAttribute(badgeImg, 'src', badgeData.picture.url);
                  this.renderer.setAttribute(badgeImg, 'alt', badgeData.name || 'Badge');
                }

                this.renderer.appendChild(userName, badgeImg);
              });
            }
  
            // Ajout du bouton delete
            const commentId = this.newComment.id;
            const deleteButton = this.renderer.createElement('i');
            this.renderer.setAttribute(deleteButton, 'id', 'delete-comment-icon');
            this.renderer.addClass(deleteButton, 'ri-delete-bin-line');
            this.renderer.setStyle(deleteButton, 'color', 'red');
            this.renderer.listen(deleteButton, 'click', () => this.onDeleteBtnClick(commentId));
            this.renderer.appendChild(commentUser, deleteButton);
  
            this.renderer.appendChild(commentCard, commentUser);
  
            // Comment text div
            const commentText = this.renderer.createElement('p');
            this.renderer.addClass(commentText, 'comment-text');
            this.renderer.setProperty(commentText, 'textContent', this.newComment.content);
            this.renderer.appendChild(commentCard, commentText);
  
            // Comment border div
            const commentBorder = this.renderer.createElement('div');
            this.renderer.setAttribute(commentBorder, 'id', `b${this.newComment.id}`);
            this.renderer.addClass(commentBorder, 'comment-border');
            this.renderer.addClass(commentBorder, 'mb-4');
  
            // Insertion des éléments dans le dom
            if (noteSpanGame.firstChild) {
              this.renderer.insertBefore(noteSpanGame, commentCard, noteSpanGame.firstChild);

              // Ajout de la border après la carte
              this.renderer.insertBefore(noteSpanGame, commentBorder, commentCard.nextSibling);
            } else {

              this.renderer.appendChild(noteSpanGame, commentCard);
              this.renderer.appendChild(noteSpanGame, commentBorder);
            }
          }

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
      });
    }
  }
      

  getBadgesForAllUsers() {
    // Obtenez les badges pour chaque utilisateur et stockez-les dans badgeByUser
    if (this.commentByActu){

      this.commentByActu.forEach(comment => {
        this.badgeService.getBadgeByUser(comment.user.id, this.app.setURL()).subscribe((ReponseApi) => {
          if (ReponseApi.message == 'good') {
            this.badgeForAllUser[comment.user.id] = ReponseApi.result;
          }
        });
      });

    }

  }

  onDeleteBtnClick(commentId: number) {
    // console.log(commentId);
    this.commentService.deleteCommentInActu(commentId, this.app.setURL()).subscribe((ReponseApi) => {
      if (ReponseApi.message == 'Comment deleted successfully') {
        const borderToDelete = document.getElementById('b'+commentId)
        const commentToDelete = document.getElementById('c'+commentId)
    
        if (commentToDelete) {
          commentToDelete.style.display = 'none'
        }
    
        if (borderToDelete) {
          borderToDelete.style.display = 'none'
        }

        if (typeof this.nbComment == 'number' && this.nbComment > 0 ) {
          console.log(this.nbComment)
          this.nbComment--
          console.log(this.nbComment)
          
          const commentHTML = document.querySelector('#comment-value')
          if (commentHTML) {
            commentHTML.textContent =  this.nbComment.toString()
          }
          
          const noComment = document.querySelector('#no-comment') as HTMLElement
          if (typeof this.nbComment == 'number' && this.nbComment == 0 ) {
            if (noComment !== null) {
              noComment.style.display = 'block'
            } else {
              const form = document.querySelector('#addCommentForm')
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
        console.log('erreur ou pas de commentaire') // TODO: Ajouter les gestions d'erreurs
      }
    });


  }

  extractFirstLetter(str: string|any): string {
    return str.charAt(0);
  }

}
