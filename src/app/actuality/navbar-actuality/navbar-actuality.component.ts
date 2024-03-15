import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ProviderService} from "../../-service/provider.service";
import {UserInterface} from "../../-interface/user.interface";
import {ProviderInterface} from "../../-interface/provider.interface";
import {FollowService} from "../../-service/follow.service";
import {FollowInterface} from "../../-interface/follow.interface";

@Component({
  selector: 'app-navbar-actuality',
  templateUrl: './navbar-actuality.component.html',
  styleUrls: ['./navbar-actuality.component.css']
})
export class NavbarActualityComponent implements OnInit {

  isLogIn:boolean|undefined;
  userConnected:UserInterface|undefined;
  providerFollowOrAll:ProviderInterface[] = [];

  constructor(private app:AppComponent,
              private providerService:ProviderService,
              private followService:FollowService) {}

  ngOnInit(): void {
    this.isLogIn = this.app.isLoggedIn;

    if (this.isLogIn){
      // Faire une recherche sur ces follow
      this.userConnected = this.app.userConnected;

      if (this.userConnected?.id){
        this.followProviderByUser(this.userConnected.id);
      }

    } else {

      this.getProviderAll()
    }

  }

  followProviderByUser(id: number){

    this.followService.getMyFollowByUser(id, this.app.setURL()).subscribe(reponseMyFollowProvider => {
      if (reponseMyFollowProvider.message == "good") {

        let followAll:FollowInterface[] = reponseMyFollowProvider.result;

        followAll.forEach((followOne:FollowInterface) => {

          if (followOne.provider) {
            this.providerFollowOrAll.push(followOne.provider);
          }

        })

      }

    });


  }


  getProviderAll(){

    this.providerService.getAllProviders(this.app.setURL()).subscribe((responseProvider) => {
      // console.log(responseProvider);

      if (responseProvider.message == "good"){
          this.providerFollowOrAll = responseProvider.result;
      }


    });

  }







}
