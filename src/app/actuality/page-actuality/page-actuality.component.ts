import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-page-actuality',
  templateUrl: './page-actuality.component.html',
  styleUrls: ['./page-actuality.component.css']
})
export class PageActualityComponent implements OnInit{

  actualityId: number|any

  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {


    this.actualityId = this.route.snapshot.paramMap.get('id');


  }



}
