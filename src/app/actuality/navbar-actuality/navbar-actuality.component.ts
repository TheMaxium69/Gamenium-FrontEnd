import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges} from '@angular/core';
import {AppComponent} from "../../app.component";
import {ProviderService} from "../../-service/provider.service";
import {UserInterface} from "../../-interface/user.interface";
import {ProviderInterface} from "../../-interface/provider.interface";
import {FollowService} from "../../-service/follow.service";
import {FollowInterface} from "../../-interface/follow.interface";
import { PostActuInterface } from 'src/app/-interface/post-actu.interface';

@Component({
  selector: 'app-navbar-actuality',
  templateUrl: './navbar-actuality.component.html',
  styleUrls: ['./navbar-actuality.component.css']
})
export class NavbarActualityComponent implements OnInit, OnChanges {

  isLogIn:boolean|undefined;
  userConnected:UserInterface|undefined;
  isUserManagingProvider: boolean = false
  followAll:FollowInterface[] = [];
  providerFollowOrAll:ProviderInterface[] = [];

  mouseDown: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  isLoadingFollow = true;

  constructor(
    protected app:AppComponent,
    private providerService:ProviderService,
    private followService:FollowService,
    private renderer: Renderer2
  ) {}

  @Output()
  providerSelected: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  providerFollowed: EventEmitter<ProviderInterface[]> = new EventEmitter<ProviderInterface[]>();

  @Output()
  isProviderModalOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  providerFollowActuAll: PostActuInterface[] = []
  
  @Input()
  providersFollowedRefreshed: ProviderInterface[] = []

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['providersFollowedRefreshed']) {
      console.log('refresh')
      this.providerFollowOrAll = this.providersFollowedRefreshed
    }
  }

  followProviderByUser(id: number){

    this.followService.getMyFollowByUser(id, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyFollowProvider => {
      if (reponseMyFollowProvider.message == "good") {

        // let followAll:FollowInterface[] = reponseMyFollowProvider.result;
        this.followAll = reponseMyFollowProvider.result;
        this.isLoadingFollow = false;

        this.followAll.forEach((followOne:FollowInterface) => {

          if (followOne.provider) {
            this.providerFollowOrAll.push(followOne.provider);
          }

        })

      }
      this.providerFollowed.emit(this.providerFollowOrAll)
    }, (error) => {
      this.isLoadingFollow = false;
    });


  }

  selectOneProviderActu(providerId: number) {

    this.followAll.forEach((followOne:FollowInterface) => {

      if (followOne?.provider?.id == providerId) {
        console.log(followOne.provider.id)
        return this.providerSelected.emit(followOne.provider.id)
      }

    })
  }


  getProviderAll(){

    this.providerService.getAllProviders(this.app.setURL(), this.app.createCorsToken()).subscribe((responseProvider) => {
      // console.log(responseProvider);

      if (responseProvider.message == "good"){
          this.providerFollowOrAll = responseProvider.result;
      }


      this.isLoadingFollow = false;
    }, (error) => {
      this.isLoadingFollow = false;
    });

  }

  getProvidersSortedByLastActu(): ProviderInterface[] {
    const providerByLastPost = this.providerFollowOrAll.sort((a, b) => {
      const latestA = this.getLatestActuDate(a.id);
      const latestB = this.getLatestActuDate(b.id);

      return new Date(latestB).getTime() - new Date(latestA).getTime();
    });

    return providerByLastPost;
  }

  getLatestActuDate(providerId: number): string {
    const latestActu = this.providerFollowActuAll
    .filter(actu => actu.Provider?.id === providerId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    return latestActu ? latestActu.created_at.toString() : '0';
  }

  isPostRecent(providerId: number): boolean {
    const latestActuDate = this.getLatestActuDate(providerId);
    if (latestActuDate === '0') {
      return false;
    }

    const twoDaysInMS = 172800000;
    const lastPostInMS = new Date(latestActuDate).getTime();
    let isRecent = Date.now() - lastPostInMS <= twoDaysInMS;

    if (!isRecent) {
      return false
    } else {
      return isRecent = true;
    }
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

  toggleProviderModal() {
    if (!this.isUserManagingProvider) {
      this.isUserManagingProvider = true
      this.isProviderModalOpen.emit(this.isUserManagingProvider)
      console.log('data sent:' + this.isUserManagingProvider)

    } else {
      this.isUserManagingProvider = false
      this.isProviderModalOpen.emit(this.isUserManagingProvider)
      console.log('data sent:' + this.isUserManagingProvider)
    }
  }

}
