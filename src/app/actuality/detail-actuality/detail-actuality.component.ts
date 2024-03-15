import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostActuService} from "../../-service/post-actu.service";
import {AppComponent} from "../../app.component";
import {PostActuInterface} from "../../-interface/post-actu.interface";

@Component({
  selector: 'app-detail-actuality',
  templateUrl: './detail-actuality.component.html',
  styleUrls: ['./detail-actuality.component.css']
})
export class DetailActualityComponent implements OnInit{

  actualityId: string|any;
  actualitySelected: PostActuInterface|undefined;
  noneActu: boolean = false;

  nbLike:number = 10;
  nbCommentaire:number = 10;

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

      } else {

        this.noneActu = true;

      }


    });
  }


}
