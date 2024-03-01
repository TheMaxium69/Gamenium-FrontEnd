import { Component, OnInit } from '@angular/core';
import { BuyWhereService } from '../../-service/buy-where.service';
import { BuyWhereInterface } from '../../-interface/buy-where.interface';

@Component({
  selector: 'app-buy-where',
  templateUrl: './buy-where.interface.component.html',
  styleUrls: ['./buy-where.interface.component.css'],
})
export class BuyWhereInterfaceComponent implements OnInit {
  buyWheres: BuyWhereInterface[] = [];

  constructor(private buyWhereService: BuyWhereService) {}

  ngOnInit(): void {
    this.getBuyWheres();
  }

  getBuyWheres(): void {
    this.buyWhereService.getAllBuyWheres().subscribe((buyWheres) => {
      this.buyWheres = buyWheres;
    });
  }
}
