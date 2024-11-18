import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProviderInterface } from "../../-interface/provider.interface";
import { ProviderService } from "../../-service/provider.service";
import { AppComponent } from "../../app.component";
import { FollowService } from "../../-service/follow.service"; // Importez le service FollowService
import { PostActuService } from "../../-service/post-actu.service";
import { PostActuInterface } from "../../-interface/post-actu.interface";
import { UserInterface } from 'src/app/-interface/user.interface';


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
  providerNbFollower: number|undefined; 
  postactuSelected: PostActuInterface|undefined; 
  actus: any[] = [];
  idUser: number | undefined;
  isProviderFollowedByUser: boolean | undefined;
  providerNbActu: number|undefined;

  constructor(
    private route: ActivatedRoute,
    private providerService: ProviderService,
    private followService: FollowService, 
    private postactuService: PostActuService, 
    private app: AppComponent
  ) {}


  //fake variables
  providerNbGame: number|undefined=2689;
  actuTitle: string|undefined='test'
  //end

  ngOnInit(): void {

    this.userConnected = this.app.userConnected;
    this.idUser = this.userConnected?.id;

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
      if (reponseProviders.message !== "Provider not found"){
        this.providerSelected = reponseProviders.result;
      } else {
        this.noneProvider = true;
      }
    });
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
      btnTxt.style.backgroundColor = 'white'
      btnTxt.style.color = this.providerSelected?.color ?? 'red'
      btnTxt.style.border = '2px solid'
      btnTxt.style.borderColor = this.providerSelected?.color ?? 'red'
      btnTxt.style.transition = 'all 0.2s ease';
    }
  }

  followBtnMouseLeave() {
    // console.log('mouse leave')
    const btnTxt = document.querySelector('#button-follow-text') as HTMLElement
    if (btnTxt) {
      btnTxt.textContent = this.isProviderFollowedByUser ? 'Suivie' : 'Suivre'
      btnTxt.style.backgroundColor = this.providerSelected?.color ?? 'red'
      btnTxt.style.color = 'white'
      btnTxt.style.border = 'none'
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
}
