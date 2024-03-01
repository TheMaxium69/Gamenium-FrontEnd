import { Component, OnInit } from '@angular/core';
import { MyAccountExterneService } from '../../-service/my-account-externe.service';
import { MyAccountExterneInterface } from '../../-interface/my-account-externe.interface';

@Component({
  selector: 'app-my-account-externe',
  templateUrl: './my-account-externe.interface.component.html',
  styleUrls: ['./my-account-externe.interface.component.css'],
})
export class MyAccountExterneInterfaceComponent implements OnInit {
  MyAccountExternes: MyAccountExterneInterface[] = [];

  constructor(private MyAccountExterneService: MyAccountExterneService) {}

  ngOnInit(): void {
    this.getAllMyAccountExternes();
  }

  getAllMyAccountExternes(): void {
    this.MyAccountExterneService.getAllMyAccountsExterne().subscribe((MyAccountExternes) => {
      this.MyAccountExternes = MyAccountExternes;
    });
  }
}
