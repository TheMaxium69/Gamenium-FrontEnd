import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProviderInterface } from "../../-interface/provider.interface";
import { ProviderService } from "../../-service/provider.service";
import { AppComponent } from "../../app.component";
import { FollowService } from "../../-service/follow.service"; // Importez le service FollowService
import { PostActuService } from "../../-service/post-actu.service";
import { PostActuInterface } from "../../-interface/post-actu.interface";
import { UserInterface } from 'src/app/-interface/user.interface';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import Swal from "sweetalert2";
import { ViewService } from 'src/app/-service/view.service';
import { ApicallInterface } from 'src/app/-interface/apicall.interface';
// import "/node_modules/flag-icons/css/flag-icons.min.css";
registerLocaleData(localeFr, 'fr');


@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit{

  userConnected: UserInterface | undefined;
  providerId: number|any;
  providerSelected: ProviderInterface|undefined;
  noneProvider:boolean|undefined = false;
  nonePostActu:boolean|undefined = false;
  postactuSelected: PostActuInterface|undefined;
  actus: any[] = [];
  idUser: number | undefined;
  isProviderFollowedByUser: boolean | undefined;

  /*STAT*/
  providerNbFollower: number|undefined;
  providerNbActu: number|undefined;
  providerNbGame: number|undefined;

  constructor(
    private route: ActivatedRoute,
    private providerService: ProviderService,
    private followService: FollowService,
    private viewService: ViewService,
    private postactuService: PostActuService,
    protected app: AppComponent
  ) {}



  ngOnInit(): void {

    this.userConnected = this.app.userConnected;
    this.idUser = this.userConnected?.id;

    console.log(this.providerNbActu);

    if (this.idUser) {
      this.checkIfUserFollowProvider(this.idUser)
      console.log(this.isProviderFollowedByUser)
    }

    this.providerId = this.route.snapshot.paramMap.get('id');
    console.log("Provider Id", this.providerId)

    this.getProviders(this.providerId);
    this.getNumberOfFollowers(this.providerId);
  }

  getProviders(id:number): void {
    this.providerService.getProviderById(id, this.app.setURL()).subscribe((reponseProviders) => {
      if (reponseProviders.message == "good"){
        this.providerSelected = reponseProviders.result;

        if(this.providerSelected){
          this.addPoviderView(this.providerSelected.id)
        }
      } else {
        this.noneProvider = true;
        Swal.fire({
          title: 'Erreur!',
          text: 'Aucun profile trouver',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.colorDefault
        })
      }
    }, (error) => this.app.erreurSubcribe());
  }

  updateNbProviderActu(nbActu: number) {
    this.providerNbActu = nbActu;
  }

  checkIfUserFollowProvider(userId: number) {
    this.providerId = this.route.snapshot.paramMap.get('id')

    this.followService.getFollowByProvider(this.providerId, this.app.setURL()).subscribe((reponseApi) => {
      if (reponseApi.message == 'good') {
        this.isProviderFollowedByUser = reponseApi.result.some((result: any) => result.user.id == userId)
      } else {
        this.isProviderFollowedByUser = false
      }
    })
  }

  getNumberOfFollowers(providerId: number): void {
    this.followService.getFollowByProvider(providerId, this.app.setURL()).subscribe(
      (response) => {
        if (response.result) {
          this.providerNbFollower = response.result.length;
        } else {
          this.providerNbFollower = 0;
        }
      },
      (error) => {
        console.error(`Error fetching followers for provider ${providerId}:`, error);
      }
    );
  }

  setNumberOfActus (event: number): void {
    this.providerNbActu = event;
  }

  getLatestPostActus(id:number): void {
    this.postactuService.getLatestPostActus(id, this.app.setURL()).subscribe((reponsePostActus) => {
      if (reponsePostActus.message !== "PostActus not found"){
        this.postactuSelected = reponsePostActus.result;
        console.log(reponsePostActus.result)
      } else {
        this.nonePostActu = true;
      }
    });
  }

  followBtnClick(providerId: number) {
    // Ajoute du follow
    if (!this.isProviderFollowedByUser) {
      this.addFollow(providerId)

    // Reire le follow
    } else if (this.isProviderFollowedByUser) {
      this.deleteFollow(providerId)
    }
  }

  followBtnMouseEnter() {
    // console.log('mouse enter')
    const btnTxt = document.querySelector('#button-follow-text') as HTMLElement
    if (btnTxt && this.isProviderFollowedByUser) {
      btnTxt.textContent = 'Ne plus suivre'
      btnTxt.style.transition = 'all 0.2s ease';
    }
  }

  followBtnMouseLeave() {
    // console.log('mouse leave')
    const btnTxt = document.querySelector('#button-follow-text') as HTMLElement
    if (btnTxt) {
      btnTxt.textContent = this.isProviderFollowedByUser ? 'Suivie' : 'Suivre'
      btnTxt.style.transition = 'all 0.2s ease';
    }
  }

  addFollow(providerId: number) {
    let body: any = {
      "id_provider": providerId,
    };
    const JSONbody = JSON.stringify(body);

    this.followService.postFollowProvider(JSONbody, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseProvider) => {
      if (reponseProvider.message == 'good') {
        this.isProviderFollowedByUser = true
        console.log('succès du follow')
      }
    })

    // console.log(providerId);
  }

  deleteFollow(providerId: number) {
    console.log('btn clicked')
    this.followService.deleteFollowProvider(providerId, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseApi) => {
      if (reponseApi.message == 'follow deleted successfully') {
        this.isProviderFollowedByUser = false
        console.log('follow supprimé avec succès')
      }
    })

    // console.log(providerId);
  }

  addPoviderView(id:number){

    setTimeout(() => {

      let bodyNoJson = {
        "id": id,
        "ip": "10.10.10.10"
      }

      let body = JSON.stringify(bodyNoJson);

      this.viewService.addProviderView(body, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseAddViewActu:ApicallInterface) => {
        if (reponseAddViewActu.message == "good"){
          console.log("+1 vue");
        }
      })

    }, this.app.deadlineView)
  }
}
