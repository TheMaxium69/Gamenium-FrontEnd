import { Component, OnInit } from '@angular/core';
import { BadgeService } from '../../-service/badge.service';
import { BadgeInterface } from '../../-interface/badge.interface';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.interface.component.html',
  styleUrls: ['./badge.interface.component.css'],
})
export class BadgeInterfaceComponent implements OnInit {
  Badges: BadgeInterface[] = [];

  constructor(private BadgeService: BadgeService) {}

  ngOnInit(): void {
    this.getBadges();
  }

  getBadges(): void {
    this.BadgeService.getAllBadges().subscribe((Badges) => {
      this.Badges = Badges;
    });
  }
}