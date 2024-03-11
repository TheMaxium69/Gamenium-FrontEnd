import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProviderInterface} from "../../-interface/provider.interface";
import {ProviderService} from "../../-service/provider.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit{

  providerId: number|any;
  providerSelected: ProviderInterface|undefined;
  noneProvider:boolean|undefined = false;

  //fake variables
  providerNbFollower: number|undefined=10000;
  providerNbFollower1: number|undefined=10;
  providerNbActu: number|undefined=8;
  providerNbGame: number|undefined=2689;
  //end

  constructor(private route: ActivatedRoute,
              private providerService: ProviderService,
              private app: AppComponent) {
  }

  ngOnInit(): void {

    this.providerId = this.route.snapshot.paramMap.get('id');

    console.log("Provider Id", this.providerId)

    this.getProviders(this.providerId);

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

}
