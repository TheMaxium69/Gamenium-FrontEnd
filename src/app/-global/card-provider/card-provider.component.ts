import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ProviderInterface } from 'src/app/-interface/provider.interface';
import { UserInterface } from 'src/app/-interface/user.interface';
import { FollowService } from 'src/app/-service/follow.service';
import { AppComponent } from 'src/app/app.component';
import {GameInterface} from "../../-interface/game.interface";


@Component({
  selector: 'app-card-provider',
  templateUrl: './card-provider.component.html',
  styleUrls: ['./card-provider.component.css']
})
export class CardProviderComponent implements OnInit {

  @Input() provider: ProviderInterface | null = null;
  @Input() isDetailView: boolean = false;
  @Input() colorProfil: string | undefined | null = null;
  @Input() isFollowed: boolean = false;
  @Input() game: GameInterface | undefined;

  @Output() followed: EventEmitter<number> = new EventEmitter<number>();
  @Output() unfollowed: EventEmitter<number> = new EventEmitter<number>();

  // hover effet
  hover: boolean = false;
  hoverText: string|null = null ;

  userConnected: UserInterface | undefined;
  idUser: number | undefined;

  constructor(
    protected app: AppComponent,
    private followService: FollowService

    ){ }

  ngOnInit(): void {
    this.userConnected = this.app.userConnected;
    this.idUser = this.userConnected?.id;

    if (this.provider) {
      this.checkFollowState(this.provider.id);
    }
   }

   checkFollowState(providerId: number): void {
    this.followService.getFollowByProvider(providerId, this.app.setURL(), this.app.createCorsToken()).subscribe({
      next: (response) => {
        if (response.message === 'good') {
          this.isFollowed = response.result.some((item: any) => item.user.id === this.idUser);
        } else {
          this.isFollowed = false;
        }
      },
      error: (err) => {
        console.error(`Error checking follow state for provider ${providerId}:`, err);
        this.isFollowed = false;
      }
    });
  }

  onFollow(): void {
    if (this.provider) {
      if (!this.isFollowed) {
        this.addFollow(this.provider.id);
      } else {
        this.deleteFollow(this.provider.id);
      }
    }
  }

  addFollow(providerId: number): void {
    const body = { id_provider: providerId };
    this.followService.postFollowProvider(
      JSON.stringify(body),
      this.app.setURL(),
      this.app.createCorsToken()
    ).subscribe((response) => {
      if (response.message === 'good') {
        this.isFollowed = true;
        this.followed.emit(providerId); // notifie le parent
      }
    });
  }

  deleteFollow(providerId: number): void {
    this.followService.deleteFollowProvider(
      providerId,
      this.app.setURL(),
      this.app.createCorsToken()
    ).subscribe((response) => {
      if (response.message === 'follow deleted successfully') {
        this.isFollowed = false;
        this.unfollowed.emit(providerId); // notify le parent
      }
    });
  }

  onMouseEnter(): void {
    this.hoverText = this.isFollowed ? 'Ne plus suivre' : 'Suivre';
  }

  // rest le hover text
  onMouseLeave(): void {
    this.hoverText = null;
  }

  // recupere le text a afficher sur le bouton
  getButtonText(): string {
    return this.hoverText ?? (this.isFollowed ? 'Suivie' : 'Suivre');
  }

}
