import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-page-game',
  templateUrl: './page-game.component.html',
  styleUrls: ['./page-game.component.css']
})
export class PageGameComponent implements OnInit {

  gameId: number|any

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private app:AppComponent) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');

    if (!this.app.isLoggedIn){
      this.router.navigate(['/account']);
    }

  }

}
