import { Component, OnInit } from '@angular/core';
import { PlateformInterface } from '../../-interface/plateform.interface';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.interface.component.html',
  styleUrls: ['./platform.interface.component.css'],
})
export class PlatformInterfaceComponent implements OnInit {
  Platforms: PlateformInterface[] = [];

  constructor() {}

  ngOnInit(): void {
    // this.getAllPlatforms();
  }

  // getAllPlatforms(): void {
  //   this.PlatformService.getAllPlatforms().subscribe((Platforms) => {
  //     this.Platforms = Platforms;
  //   });
  // }
}
