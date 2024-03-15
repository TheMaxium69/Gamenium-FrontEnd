import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {CommentService} from "../../-service/comment.service";

@Component({
  selector: 'app-detail-actuality',
  templateUrl: './detail-actuality.component.html',
  styleUrls: ['./detail-actuality.component.css']
})
export class DetailActualityComponent implements OnInit{

  actualityId: string|any;
  actualitySelected: PostActuInterface|undefined;
  noneActu: boolean = false;

  nbLike:number = 0;
  nbCommentaire:number = 0;

  constructor(private route: ActivatedRoute,
              private postActu: PostActuService,
              private app: AppComponent,
              private commentService:CommentService) {}

  ngOnInit(): void {

    this.actualityId = this.route.snapshot.paramMap.get('id');

    this.getActuById(this.actualityId);


    this.getCommentWithActu(this.actualityId);


  }


  getActuById(id:number){

    this.postActu.getPostActuById(id, this.app.setURL()).subscribe((reponsePostActu) => {

      if (reponsePostActu.message == "good"){

        this.actualitySelected = reponsePostActu.result

        console.log(this.actualitySelected)


      } else {

        this.noneActu = true;

      }


    });
  }

  getCommentWithActu(id:number){

    this.commentService.getCommentWithActu(id, this.app.setURL()).subscribe(reponseMyCommentActu => {
      if (reponseMyCommentActu.message == "good") {

        this.nbCommentaire = reponseMyCommentActu.result.length;

      }

    });

  }

  followUs(id: number | undefined) {

    console.log("follow")

  }
}
