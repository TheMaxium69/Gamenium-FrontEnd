import { Component, OnInit } from '@angular/core';
import { GameInterface } from 'src/app/-interface/game.interface';
import { PostActuInterface } from 'src/app/-interface/post-actu.interface';
import { GameService } from 'src/app/-service/game.service';
import { PostActuService } from 'src/app/-service/post-actu.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home-invite',
  templateUrl: './home-invite.component.html',
  styleUrls: ['./home-invite.component.css']
})
export class HomeInviteComponent implements OnInit {
  postActuFollowOrAll: PostActuInterface[] = [];
  games: GameInterface[] = [];
  searchValue: string = ''

  constructor(
    private app: AppComponent,
    private postActuService: PostActuService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.getActuAll();
    this.getGames();
  }

  getActuAll() {
    console.log('Fetching all actualities');
    this.postActuService.getActuAll(this.app.setURL()).subscribe(responseActu => {
      if (responseActu.message === 'good') {
        this.postActuFollowOrAll = responseActu.result;
      } else {
        console.log("failed fetching")
      }
    });
  }

  getGames() {
    console.log('Fetching games');
    this.gameService.searchGames(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
      this.games = results;
    });
  }

}

