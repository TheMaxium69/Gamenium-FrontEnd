import {ChangeDetectorRef, Component, OnInit, Provider} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { PostActuInterface } from 'src/app/-interface/post-actu.interface';
import { ProviderInterface } from 'src/app/-interface/provider.interface';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-page-actuality',
  templateUrl: './page-actuality.component.html',
  styleUrls: ['./page-actuality.component.css']
})
export class PageActualityComponent implements OnInit{

  actualityId: number|any
  providerId: number|any
  providerSelected: number | undefined;
  lastProviderSelected: number | undefined;
  providerFollowed: ProviderInterface[] = []
  providerFollowActuAll: PostActuInterface[] = []
  manageProviders: boolean = false
  temp: ProviderInterface[] = []


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private app:AppComponent,
  ) {}

  ngOnInit(): void {


    this.actualityId = this.route.snapshot.paramMap.get('id');
    this.providerId = this.route.snapshot.paramMap.get('idprovider');
    this.app.currentUrl = this.router.url;

    // if (!this.app.isLoggedIn){
    //   this.router.navigate(['/account']);
    // }
    //
    // if (!this.app.isAccess){
    //   this.router.navigate(['/waiting']);
    // }

  }

  onProviderSelected(providerId: number) {
    if (this.lastProviderSelected === providerId) {
      console.log('Same provider clicked, resetting to all');
      this.providerSelected = undefined;
      this.lastProviderSelected = undefined;

    } else {
      console.log('Provider selected:', providerId);
      this.providerSelected = providerId;
      this.lastProviderSelected = providerId;

    }

  }

  getProviderFollowed(providers: ProviderInterface[]) {
    this.providerFollowed = providers
    console.log(this.providerFollowed)
  }

  openModal(event: any) {
    this.manageProviders = event;
    console.log('open modal called with parameter:' + event);
  }

  providerActu(event: PostActuInterface[]) {
    this.providerFollowActuAll = event
  }

}
