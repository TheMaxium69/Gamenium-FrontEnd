import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../-service/provider.service';
import { ProviderInterface } from '../../-interface/provider.interface';

@Component({
  selector: 'app-Provider',
  templateUrl: './provider.interface.component.html',
  styleUrls: ['./provider.interface.component.css'],
})
export class ProviderInterfaceComponent implements OnInit {
  Providers: ProviderInterface[] = [];

  constructor(private ProviderService: ProviderService) {}

  ngOnInit(): void {
    this.getProviders();
  }

  getProviders(): void {
    this.ProviderService.getAllProviders().subscribe((Providers) => {
      this.Providers = Providers;
    });
  }
}