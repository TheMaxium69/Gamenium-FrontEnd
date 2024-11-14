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


  constructor(private route: ActivatedRoute,
              private providerService: ProviderService,
              private followService: FollowService, 
              private postactuService: PostActuService, 
              private app: AppComponent) {
  }

  idUser: number | undefined;
  isProviderFollowedByUser: boolean | undefined;
  //fake variables
  providerNbActu: number|undefined=8;
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

  onFollowBtnClick(providerId: number) {
    let body: any = {
      "id_provider": providerId,
    };
    const JSONbody = JSON.stringify(body);

    this.followService.postFollowProvider(JSONbody, this.app.setURL(), this.app.createCorsToken()).subscribe((reponseProvider) => {
      if (reponseProvider.message == 'good') {
        console.log('succès du follow')
      }
    })

    console.log(providerId);
  }

}
