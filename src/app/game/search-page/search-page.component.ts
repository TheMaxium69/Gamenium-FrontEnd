import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameInterface} from "../../-interface/game.interface";
import {GameService} from "../../-service/game.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit{

  searchValue: string = '';
  searchType: string | null = '';

  games: GameInterface[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private app: AppComponent) {
  }

  ngOnInit(): void {

    let searchValueTemp = this.route.snapshot.paramMap.get('value');
    if (searchValueTemp){
      this.searchValue = searchValueTemp;
    }
    this.searchType = this.route.snapshot.paramMap.get('type');

    if (this.searchType == 'game'){
      this.searchGame()
    } else if (this.searchType == 'user'){
      this.searchUser()
    } else if (this.searchType == 'provider'){
      this.searchProvider()
    }

  }


  changeType(type:string) {
    this.searchType = type;
    this.router.navigate(['/search/'+ type +'/' + this.searchValue]);
  }

  searchGame(): void {

    this.gameService.searchGames(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
      this.games = results;
    });

  }

  searchUser(): void {
    console.log("Faire le search User");
  }

  searchProvider(): void {
    console.log("Faire le search Provider");
  }

}
