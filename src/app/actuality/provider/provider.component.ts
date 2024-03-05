import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit{

  providerId: number|any;
  provider

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.providerId = this.route.snapshot.paramMap.get('id');

    console.log("Game Id", this.providerId)

  }




}
