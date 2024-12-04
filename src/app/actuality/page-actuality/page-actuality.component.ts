import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { ProviderInterface } from 'src/app/-interface/provider.interface';

@Component({
  selector: 'app-page-actuality',
  templateUrl: './page-actuality.component.html',
  styleUrls: ['./page-actuality.component.css']
})
export class PageActualityComponent implements OnInit{

  actualityId: number|any
  providerSelected: number | undefined;
  lastProviderSelected: number | undefined;
  providerFollowed: ProviderInterface[] = []

  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {


    this.actualityId = this.route.snapshot.paramMap.get('id');


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

}
