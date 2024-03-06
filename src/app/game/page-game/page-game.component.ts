import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-page-game',
  templateUrl: './page-game.component.html',
  styleUrls: ['./page-game.component.css']
})
export class PageGameComponent implements OnInit {

  gameId: number|any

  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');

  }

}
