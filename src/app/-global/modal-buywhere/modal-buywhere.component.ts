import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {BuyWhereInterface} from "../../-interface/buy-where.interface";
import {BuyWhereService} from "../../-service/buy-where.service";
import Swal from "sweetalert2";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'modal-buywhere',
  templateUrl: './modal-buywhere.component.html',
  styleUrls: ['./modal-buywhere.component.css']
})
export class ModalBuywhereComponent implements OnInit{

  constructor(protected app:AppComponent,
              private buyWhereService:BuyWhereService,) {}


  ngOnInit() {
    this.getBuyWhere();
  }

  haveBuywhere: number = 0;

  getBuyWhere() {
    // console.log(this.app.buyWhereUserNoReload)

    if (this.app.buyWhereUserNoReload.length == 0){

      this.buyWhereService.getAllBuyWheresByUser(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseBuyWhere: { message: string; result: BuyWhereInterface[]; }) => {
        if (reponseBuyWhere.message == "good") {
          this.app.buyWhereUserNoReload = reponseBuyWhere.result;

          this.app.buyWhereUserNoReload.forEach(buyWhere => {
            if (!buyWhere.is_public) {
              this.haveBuywhere++;
            }
          });

        }
      }, (error) => this.app.erreurSubcribe())

    } else {
      this.app.buyWhereUserNoReload.forEach(buyWhere => {
        if (!buyWhere.is_public) {
          this.haveBuywhere++;
        }
      });
    }

  }

  deleteBuyWhere(buyWhere:BuyWhereInterface) {

    this.buyWhereService.deleteBuyWhere(buyWhere.id, this.app.setURL(), this.app.createCorsToken()).subscribe((response: { message: string; }) => {
      if (response.message === "good") {
        const index = this.app.buyWhereUserNoReload.findIndex(item => item.id === buyWhere.id);
        if (index !== -1) {
          this.app.buyWhereUserNoReload.splice(index, 1);
        }
        this.haveBuywhere--;
        Swal.fire({
          title: 'Succès!',
          text: buyWhere.name + ' a bien été supprimé',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      } else if (response.message === "buywhere is use") {
        Swal.fire({
          title: 'Attention!',
          text: 'Vous ne pouvez pas supprimer un lieu d\'achat que vous utilisez',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })

      } else {
        Swal.fire({
          title: 'Echec!',
          text: 'Echec de la suppression de votre lieu d\'achat',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }
    }, (error) => this.app.erreurSubcribe());

  }

  addBuyWhere(form:NgForm) {

    let nameNewBuyWhere = form.value['name_buywhere']

    if (nameNewBuyWhere.toString().trim() == ""){
      return;
    }

    let bodyNoJson: any = {
      "name" : nameNewBuyWhere
    }

    let body:string = JSON.stringify(bodyNoJson);

    this.buyWhereService.createBuyWhere(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseCreateBuyWhere:{message:string, result:BuyWhereInterface}) => {
      if (reponseCreateBuyWhere.message == "good") {

        this.app.buyWhereUserNoReload.push(reponseCreateBuyWhere.result);

        form.resetForm();
        this.haveBuywhere++;

        Swal.fire({
          title: 'Succès!',
          text: nameNewBuyWhere + ' a bien été créer',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })

      } else if (reponseCreateBuyWhere.message == "BuyWhere already exist") {
        Swal.fire({
          title: 'Attention!',
          text: 'Attention votre lieu d\'achat existe déjà',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      } else {
        Swal.fire({
          title: 'Echec!',
          text: 'Echec de la création de votre lieu d\'achat',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }
    }, (error) => this.app.erreurSubcribe())

  }


}
