import { Component, OnInit } from '@angular/core';
import { BadgeVersUserService } from '../../-service/badge-vers-user.service';
import { BadgeVersUserInterface } from '../../-interface/badge-vers-user.interface';

@Component({
  selector: 'app-badge-vers-user',
  templateUrl: './badge-vers-user.interface.component.html',
  styleUrls: ['./badge-vers-user.interface.component.css'],
})
export class BadgeVersUserInterfaceComponent implements OnInit {
  badgeversusers: BadgeVersUserInterface[] = [];

  constructor(private BadgeVersUserService: BadgeVersUserService) {}

  ngOnInit(): void {
    this.getBadgeVersUser();
  }

  getBadgeVersUser(): void {
    this.BadgeVersUserService.getAllBadgeVersUsers().subscribe((badgeversusers) => {
      this.badgeversusers = badgeversusers;
    });
  }
}
