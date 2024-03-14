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

// fake variables
  actuTitle: string|undefined = 'Titre';
  actuContent: string|undefined = 'Contenu';
  nbLike: number|undefined = 150;
  nbCommentaire: number|undefined = 20;

//End fake variables


  constructor(private route: ActivatedRoute,
              private postActu: PostActuService,
              private app: AppComponent) {}

  ngOnInit(): void {

    this.actualityId = this.route.snapshot.paramMap.get('id');

    this.getActuById(this.actualityId)

  }


  getActuById(id:number){

    this.postActu.getPostActuById(id, this.app.setURL()).subscribe((reponsePostActu) => {
      console.log(reponsePostActu)
      if (reponsePostActu.message == "good"){

        this.actualitySelected = reponsePostActu.result
        console.log(this.actualitySelected)
      } else {

        this.noneActu = true;

      }


    });
  }


}
