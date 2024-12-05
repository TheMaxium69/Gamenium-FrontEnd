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
    protected app: AppComponent,
    private postActuService: PostActuService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.getActuAll();
    this.getLatestGames(3);
  }

  getActuAll() {
    
    this.postActuService.getActuAll(this.app.setURL()).subscribe(responseActu => {
      if (responseActu.message === 'good') {
        this.postActuFollowOrAll = responseActu.result;
        console.log('Fetching all actualities');
      } else {
        console.log("failed fetching")
      }
    });
  }


  getLatestGames(limit: number){

    let bodyNoJson = {
      "limit": limit,
    }

    let body = JSON.stringify(bodyNoJson);

    console.log('Fetching latest games');
    this.gameService.getLatestGames(body, this.app.setURL()).subscribe((results) => {
      this.games = results.result;
      console.log(results.result)
    })
  }

}

