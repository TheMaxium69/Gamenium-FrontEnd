import { Component, OnInit } from '@angular/core';
import { SocialNetworkService } from '../../-service/social-network.service';
import { SocialNetworkInterface } from '../../-interface/social-network.interface';

@Component({
  selector: 'app-social-network',
  templateUrl: './social-network.interface.component.html',
  styleUrls: ['./social-network.interface.component.css'],
})
export class SocialNetworkInterfaceComponent implements OnInit {
  socialNetworks: SocialNetworkInterface[] = [];

  constructor(private SocialNetworkService: SocialNetworkService) {}

  ngOnInit(): void {
    // this.getAllSocialNetworks();
  }
}
