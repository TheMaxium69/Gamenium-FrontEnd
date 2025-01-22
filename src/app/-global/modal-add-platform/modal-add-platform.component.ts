import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BuyWhereInterface } from 'src/app/-interface/buy-where.interface';
import { BuyWhereService } from 'src/app/-service/buy-where.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-modal-add-platform',
  templateUrl: './modal-add-platform.component.html',
  styleUrls: ['./modal-add-platform.component.css']
})
export class ModalAddPlatformComponent {
  task: string|null = null;

  constructor(
    protected app:AppComponent,
    private buyWhereService: BuyWhereService,
  ) {}


  ngOnInit(){
    this.getAllInfo();
  }

  getAllInfo(){
  
    /* RECUPERE LES BUYWHERE*/
    if (this.app.buyWhereUserNoReload.length == 0) {
      this.buyWhereService.getAllBuyWheresByUser(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseBuyWhere: {
        message: string;
        result: BuyWhereInterface[];
      }) => {
        if (reponseBuyWhere.message == "good") {
          this.app.buyWhereUserNoReload = reponseBuyWhere.result;
        }
      })
    }
  }

  isLoadingMore:boolean = false;
  moreCompletion(){
    this.isLoadingMore = true;
  }

  addPlatform(form:NgForm){
    this.app.addPlatform(form, this.isLoadingMore);
  }
}
