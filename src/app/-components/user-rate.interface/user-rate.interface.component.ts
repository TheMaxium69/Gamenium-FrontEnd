import { Component, OnInit } from '@angular/core';
import { UserRateService } from '../../-service/user-rate.service';
import { UserRateInterface } from '../../-interface/user-rate.interface';

@Component({
  selector: 'app-user-rate',
  templateUrl: './user-rate.interface.component.html',
  styleUrls: ['./user-rate.interface.component.css'],
})
export class UserRateInterfaceComponent implements OnInit {
  userRates: UserRateInterface[] = [];

  constructor(private UserRateService: UserRateService) {}

  ngOnInit(): void {
    // this.getAllUserRates();
  }

}
