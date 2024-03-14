import {Component, OnInit} from '@angular/core';
import {PostActuInterface} from "../../-interface/post-actu.interface";
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-comment-actuality',
  templateUrl: './comment-actuality.component.html',
  styleUrls: ['./comment-actuality.component.css']
})
export class CommentActualityComponent implements OnInit{

  actualityId: string|any;
  actualitySelected: PostActuInterface|undefined;

  constructor(private route: ActivatedRoute,
              private postActu: PostActuService,
              private app: AppComponent) {}

  ngOnInit(): void {

    this.actualityId = this.route.snapshot.paramMap.get('id');

    this.getActuById(this.actualityId)

  }


  getActuById(id:number){

    this.postActu.getPostActuById(id, this.app.setURL()).subscribe((reponsePostActu) => {

      if (reponsePostActu.message == "good"){

        this.actualitySelected = reponsePostActu.result

      }

    });
  }


  addComment(value: NgForm) {

  }
}
