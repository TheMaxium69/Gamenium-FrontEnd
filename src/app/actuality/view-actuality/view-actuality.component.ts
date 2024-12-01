import {Component, OnInit, Input} from '@angular/core';
import { UserInterface } from "../../-interface/user.interface";
import { AppComponent } from "../../app.component";
import { PostActuService } from "../../-service/post-actu.service";
import { PostActuInterface } from "../../-interface/post-actu.interface";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-actuality',
  templateUrl: './view-actuality.component.html',
  styleUrls: ['./view-actuality.component.css']
})
export class ViewActualityComponent implements OnInit {

  @Input()
  public providerIdSelected: number | null = null;

  constructor(
    private app: AppComponent,
    private postActuService: PostActuService
  ) {}

  isLogIn: boolean | undefined;
  userConnected: UserInterface | undefined;

  postActuAll: PostActuInterface[] = [];
  postActuProvider: PostActuInterface[] = [];

  ngOnInit(): void {
    this.isLogIn = this.app.isLoggedIn;
    this.userConnected = this.app.userConnected;

    if (!this.providerIdSelected){
      if (this.isLogIn) {
        this.getActuAll(); /* Todo: Nos abonnement uniquement */
      } else {
        this.getActuAll()
      }
    } else {
      this.getActuByProvider(this.providerIdSelected);
    }
  }

  /* RECUPERE TOUTE LES ACTU */
  getActuAll() {
    this.postActuService.getActuAll(this.app.setURL()).subscribe(responseActu => {
      if (responseActu.message === 'good') {
        /*GET ACTU ALL*/
        this.postActuAll = responseActu.result;

      } else {
        Swal.fire({
          title: 'Erreur!',
          text: 'Erreur de récupération des actualités',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.userConnected?.themeColor
        })
      }
    }, error => { this.app.erreurSubcribe() });
  }

  /* RECUPERE LES ACTU D'UN PROVIDER */
  getActuByProvider(id: number) {
    this.postActuService.getPostByProvider(id, this.app.setURL()).subscribe(response => {
      if (response.message === 'good') {
        /*GET ACTU BY PROVIDER*/
        this.postActuProvider = response.result;

      }
    }, error => { this.app.erreurSubcribe() });
  }


  /*
  *
  * GENERATE VIEW
  *
  * */

  ActuAll(): PostActuInterface[]{
    /* AJOUTER DES FILTRE*/
    return this.postActuAll;
  }

  ActuByProvider(): PostActuInterface[] {
    /* AJOUTER DES FILTRE */
    return this.postActuProvider;
  }




}
