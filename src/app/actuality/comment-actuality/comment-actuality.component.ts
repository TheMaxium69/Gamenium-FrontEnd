import {Component, OnInit} from '@angular/core';
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {NgForm} from "@angular/forms";
import {CommentService} from "../../-service/comment.service";
import {CommentInterface} from "../../-interface/comment.interface";
import {BadgeService} from "../../-service/badge.service";

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

  constructor(private route: ActivatedRoute,
              private postActu: PostActuService,
              private app: AppComponent,
              private commentService:CommentService,
              private badgeService:BadgeService) {}

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

      console.log(reponseMyCommentActu)

      if (reponseMyCommentActu.message == "good") {

        this.commentByActu = reponseMyCommentActu.result;

        this.getBadgesForAllUsers();

      } else {

        console.log(reponseMyCommentActu);

      }

    });



  }


  addComment(form: NgForm) {


    console.log(form.value);

    if (form.value) {

      let content = form.value['content'];

      let bodyNoJsonMyCommentActu: any = {
        "id_actu": this.actualitySelected?.id,
        "content": content,
      };

      const bodyMyCommentActu = JSON.stringify(bodyNoJsonMyCommentActu);

      this.commentService.postCommentInActu(bodyMyCommentActu, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyCommentActuCreate => {

        if (reponseMyCommentActuCreate.message == "good") {

          console.log("commentaire ajoutée")
          // let noteSpanGame = document.getElementById("noteGame" + this.gameSelected?.id)
          // if (noteSpanGame){
          //   noteSpanGame.innerHTML = noteGame;
          // }
          //
          // const inputNote: HTMLElement | null = document.getElementById('inputNote');
          // if (inputNote) {
          //   this.renderer.setProperty(inputNote, 'value', '');
          // }


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


}
