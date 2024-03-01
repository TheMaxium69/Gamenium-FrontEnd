import { Component, OnInit } from '@angular/core';
import { PlatformService } from '../../-service/platform.service';
import { PlatformInterface } from '../../-interface/platform.interface';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.interface.component.html',
  styleUrls: ['./platform.interface.component.css'],
})
export class PlatformInterfaceComponent implements OnInit {
  Platforms: PlatformInterface[] = [];

  constructor(private PlatformService: PlatformService) {}

  ngOnInit(): void {
    this.getAllPlatforms();
  }

  getAllPlatforms(): void {
    this.PlatformService.getAllPlatforms().subscribe((Platforms) => {
      this.Platforms = Platforms;
    });
  }
}
