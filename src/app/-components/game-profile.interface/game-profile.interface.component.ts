import { Component, OnInit } from '@angular/core';
import { GameProfileService } from '../../-service/game-profile.service';
import { GameProfileInterface } from '../../-interface/game-profile.interface';

@Component({
  selector: 'app-game-profile',
  templateUrl: './game-profile.interface.component.html',
  styleUrls: ['./game-profile.interface.component.css'],
})
export class GameProfileInterfaceComponent implements OnInit {
  gameProfiles: GameProfileInterface[] = [];

  constructor(private GameProfileService: GameProfileService) {}

  ngOnInit(): void {
    this.getAllGameProfiles();
  }

  getAllGameProfiles(): void {
    this.GameProfileService.getAllGameProfiles().subscribe((gameProfiles) => {
      this.gameProfiles = gameProfiles;
    });
  }
}