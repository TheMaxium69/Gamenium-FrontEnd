import { Component, OnInit } from '@angular/core';
import { GameInterface } from 'src/app/-interface/game.interface';
import { PostActuInterface } from 'src/app/-interface/post-actu.interface';
import { ProviderInterface } from 'src/app/-interface/provider.interface';
import { GameService } from 'src/app/-service/game.service';
import { PostActuService } from 'src/app/-service/post-actu.service';
import { ProviderService } from 'src/app/-service/provider.service';
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

  providers: ProviderInterface[] = []
  randomProviders: ProviderInterface[] = [];
  unfollowedProviders: ProviderInterface[] = [];
  followedStates: { [id: number]: boolean } = {}

  constructor(
    protected app: AppComponent,
    private postActuService: PostActuService,
    private gameService: GameService,
    private providerService: ProviderService
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

    // PROVIDER 

  fetchProviders(): void {
    this.providerService.getAllProviders(this.app.setURL()).subscribe({
      next: (response) => {
        if (response && response.result) {
          this.providers = response.result;
          this.selectRandomProviders(4);
        }
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
      }
    });
  }

  handleFollowed(providerId: number): void {
    console.log(`Provider with ID ${providerId} followed.`);
    this.followedStates[providerId] = true;
  }
  
  handleUnfollowed(providerId: number): void {
    console.log(`Provider with ID ${providerId} unfollowed.`);
    this.followedStates[providerId] = false;
  }


  isProviderFollowed(providerId: number): boolean {
    return this.followedStates[providerId] || false; 
  }

  selectRandomProviders(count: number): void {
    const unfollowedProviders = this.providers.filter(provider => 
        !this.isProviderFollowed(provider.id)
    );
    const shuffled = [...unfollowedProviders].sort(() => 0.5 - Math.random());
    this.randomProviders = shuffled.slice(0, count);
  }

}

