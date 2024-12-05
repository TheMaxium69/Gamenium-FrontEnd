import { Component, Input, OnInit } from '@angular/core';
import { ProviderInterface } from 'src/app/-interface/provider.interface';

@Component({
  selector: 'app-modal-provider',
  templateUrl: './modal-provider.component.html',
  styleUrls: ['./modal-provider.component.css']
})
export class ModalProviderComponent implements OnInit {

  constructor() {

  }

  @Input()
  providerFollowed: ProviderInterface[] = []

  ngOnInit(): void {
    
  }
  

}
