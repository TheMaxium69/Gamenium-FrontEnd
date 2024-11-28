import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  followAll:FollowInterface[] = [];

  mouseDown: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;
  

  constructor(
    private app:AppComponent,
    private providerService:ProviderService,
    private followService:FollowService
  ) {}

  @Output()
  providerSelected: EventEmitter<number> = new EventEmitter<number>();

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

        // let followAll:FollowInterface[] = reponseMyFollowProvider.result;
        this.followAll = reponseMyFollowProvider.result;

        this.followAll.forEach((followOne:FollowInterface) => {

          if (followOne.provider) {
            this.providerFollowOrAll.push(followOne.provider);
          }

        })

      }

    });


  }

  selectOneProviderActu(providerId: number) {

    this.followAll.forEach((followOne:FollowInterface) => {

      if (followOne?.provider?.id == providerId) {
        return this.providerSelected.emit(followOne.provider.id)
      }

    })
  }


  getProviderAll(){

    this.providerService.getAllProviders(this.app.setURL()).subscribe((responseProvider) => {
      // console.log(responseProvider);

      if (responseProvider.message == "good"){
          this.providerFollowOrAll = responseProvider.result;
      }


    });

  }

  // Provider navbar scroll effect
  startDrag(mouse: MouseEvent): void {
    const slider = document.querySelector('#provider-nav-container') as HTMLElement;

    if (slider) {
        this.mouseDown = true;
        this.startX = mouse.pageX - slider.offsetLeft;
        this.scrollLeft = slider.scrollLeft;
    } 
    
  }

  stopDrag(): void {
    this.mouseDown = false;
  }

  move(mouse: MouseEvent): void {

    if (!this.mouseDown) {
      return;
    }

    const slider = document.querySelector('#provider-nav-container') as HTMLElement;
    
    mouse.stopPropagation();

    if (slider) {
      const x = mouse.pageX - slider.offsetLeft;
      const scroll = x - this.startX;
      slider.scrollLeft = this.scrollLeft - scroll;
    }
    
  }
  
}
