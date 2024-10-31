import {Component, OnInit, Renderer2} from '@angular/core';
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {NgForm} from "@angular/forms";
import {CommentService} from "../../-service/comment.service";
import {CommentInterface} from "../../-interface/comment.interface";
import {BadgeService} from "../../-service/badge.service";
import {BadgeInterface} from "../../-interface/badge.interface";

@Component({
  selector: 'app-comment-actuality',
  templateUrl: './comment-actuality.component.html',
  styleUrls: ['./comment-actuality.component.css']
})
export class CommentActualityComponent implements OnInit{

  isLoggedIn:boolean = false;
  userConnectedId:number|undefined;
  actualityId: string|any;
  actualitySelected: PostActuInterface|undefined;
  commentByActu: CommentInterface[]|undefined;
  badgeForAllUser: any[] = [];
  newComment : CommentInterface|undefined;

  constructor(private route: ActivatedRoute,
              private postActu: PostActuService,
              private app: AppComponent,
              private commentService:CommentService,
              private badgeService:BadgeService,
              private renderer: Renderer2) {}

  ngOnInit(): void {

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn){

      this.userConnectedId = this.app.userConnected.id;

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


    // console.log(form.value);

    if (form.value) {

      let content = form.value['content'];

      let bodyNoJsonMyCommentActu: any = {
        "id_post": this.actualitySelected?.id,
        "content": content,
      };

      const bodyMyCommentActu = JSON.stringify(bodyNoJsonMyCommentActu);

      this.commentService.postCommentInActu(bodyMyCommentActu, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyCommentActuCreate => {

        if (reponseMyCommentActuCreate.message == "good") {

          this.newComment = reponseMyCommentActuCreate.result;

          console.log("commentaire ajoutée")

          let noteSpanGame = document.getElementById("yourComment")
          if (noteSpanGame && this.newComment){

            const badges = this.badgeForAllUser[this.newComment.user.id];
            let badgesHTML = '';
            if (badges) {
              badges.forEach((badge:BadgeInterface) => {

                // Construire la représentation HTML pour chaque badge
                badgesHTML += `
                  <img style="width: 30px; margin-right: 6px;" src="${badge.picture?.url}" alt="${badge.name}">
                `;

              });
            }

            noteSpanGame.innerHTML = `
            <div class="card">
              <h4>(Vous) <span style="color:` + this.newComment?.user.color  + `">` + this.newComment?.user.displayname + `</span>`
               + badgesHTML +
              `</h4>
              <p>`+ this.newComment?.content+`</p>
            </div>

            ` + noteSpanGame.innerHTML ;


          }

          const inputNote: HTMLElement | null = document.getElementById('BtnAddComment');
          if (inputNote) {
            this.renderer.setProperty(inputNote, 'value', '');
          }


        } else {

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
    console.log(commentId);
  }

}
