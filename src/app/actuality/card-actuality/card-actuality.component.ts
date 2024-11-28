import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { UserInterface } from "../../-interface/user.interface";
import { AppComponent } from "../../app.component";
import { PostActuService } from "../../-service/post-actu.service";
import { PostActuInterface } from "../../-interface/post-actu.interface";
import { IpService } from 'src/app/-service/ip.service';
import { LikeService } from 'src/app/-service/like.service';
import { LikeInterface } from 'src/app/-interface/like.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-card-actuality',
  templateUrl: './card-actuality.component.html',
  styleUrls: ['./card-actuality.component.css']
})
export class CardActualityComponent implements OnInit, OnChanges {
  
  isLogIn: boolean | undefined;
  userConnected: UserInterface | undefined;
  userConnectedId: number | undefined;
  postActuFollowOrAll: PostActuInterface[] = [];
  postByProvider: PostActuInterface[] = [];
  LikeAll: LikeInterface[] | undefined;
  providerId: number | undefined;
  
  likedStatus: { [key: number]: boolean } = {};

  constructor(
    private app: AppComponent,
    private ipService: IpService,
    private likeService: LikeService,
    private postActuService: PostActuService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  @Input() numberOfPosts: number | undefined;

  @Input()
  providerSelected: number | undefined

  @Output()
  nbActuOfProvider: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {
    this.isLogIn = this.app.isLoggedIn;

    if (this.isLogIn) {
      this.userConnectedId = this.app.userConnected?.id;
      // console.log('User ID', this.userConnectedId); 
    }

    if (this.router.url.includes('provider')) {
      this.route.paramMap.subscribe(params => {
        this.providerId = Number(params.get('id'))
      })

      if (typeof this.providerId === 'number') {
        this.getPostByProvider(this.providerId);
        return; 
      }
    }

    if (this.isLogIn) {
      // Faire une recherche sur ces follow
      this.userConnectedId = this.app.userConnected.id;
      this.userConnected = this.app.userConnected;

      if (this.userConnected?.id) {
        this.followActuByUser(this.userConnected.id);
      }
    } else if (this.postActuFollowOrAll.length === 0) {
      this.getActuAll();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.providerSelected) {
      console.log(changes)
      if (changes['providerSelected']) {
        this.updateActu(changes['providerSelected'].currentValue);
      }
    }
  }

  updateActu(providerId: number) {
    this.getPostByProvider(providerId);
  }

  followActuByUser(id: number) {
    console.log('Fetching followed actualities');

    if (!this.router.url.includes('provider')) {
      this.getActuAll();
    }
  }

  getActuAll() {
    console.log('Fetching all actualities');
    this.postActuService.getActuAll(this.app.setURL()).subscribe(responseActu => {
      if (responseActu.message === 'good') {
        this.postActuFollowOrAll = responseActu.result;

        
        this.postActuFollowOrAll.forEach((actu: any) => {
          this.getLikeByActu(actu.id);
        });
      }
    });
  }

  getPostByProvider(id: number) {
    console.log('Fetching actualities by provider');
    this.postActuService.getPostByProvider(id, this.app.setURL()).subscribe(response => {
      if (response.message === 'good') {
        this.postActuFollowOrAll = response.result;
        // envoie le nombre d'actu du provider au commposant provider
        this.nbActuOfProvider.emit(this.postActuFollowOrAll.length);
        
        this.postActuFollowOrAll.forEach((actu: any) => {
          // console.log(this.userConnectedId)
          if (this.userConnectedId) { 
            this.getLikeByActu(actu.id);
          }
        });
      }
    });
  }

  getLikeByActu(idActu: number) {
    this.likeService.getPostActuLikes(idActu, this.app.setURL()).subscribe(responseLikeByPostActu => {
      if (responseLikeByPostActu.message === 'good') {
        let isLiked = false;

        this.LikeAll = responseLikeByPostActu.result;

        this.LikeAll?.forEach((like: LikeInterface) => {
          if (like.user.id === this.userConnectedId) {
            isLiked = true;
          }
        });

        this.likedStatus[idActu] = isLiked;
      }
    });
  }

  onClickLike(id: number) {
    const cardActuIcon = document.querySelector(`#likeIcon${id}`);

    if (!this.isLogIn) {
      return console.log('Impossible de liker: User pas connecté')
    }

    this.ipService.getMyIp(this.app.urlIp).subscribe(
      responseTyroIp => {
        let bodyNoJson: any = {
          id_postactu: id,
          ip: responseTyroIp.ip,
          del: true
        };

        let bodyJson = JSON.stringify(bodyNoJson);

        this.likeService
          .addLikePostActu(bodyJson, this.app.setURL(), this.app.createCorsToken())
          .subscribe(responseAddLikeByPostActu => {
            if (responseAddLikeByPostActu.message === 'good') {
              if (cardActuIcon) {
                if (responseAddLikeByPostActu.result === 'like is delete') {
                  this.liked(id, 'del');
                  this.likedStatus[id] = false;
                } else {
                  this.liked(id, 'add');
                  this.likedStatus[id] = true;
                }
              }
            }
          });
      },
      error => {
        let bodyNoJson: any = {
          id_postactu: id,
          del: true
        };

        let bodyJson = JSON.stringify(bodyNoJson);

        this.likeService
          .addLikePostActu(bodyJson, this.app.setURL(), this.app.createCorsToken())
          .subscribe(responseAddLikeByPostActu => {
            if (responseAddLikeByPostActu.message === 'good') {
      
            }
          });
      }
    );
  }

  liked(id: number, state: string) {
    const cardActuIcon = document.querySelector(`#likeIcon${id}`) as HTMLElement;
    const actu = this.postActuFollowOrAll.find(actu => actu.id === id);

    if (state === 'add' && cardActuIcon) {
      if (actu) {
        cardActuIcon.style.color = actu.Provider?.color ? actu.Provider?.color : 'red';
      }
      cardActuIcon.classList.remove('ri-heart-line');
      cardActuIcon.classList.add('ri-heart-fill');
    } else if (state === 'del' && cardActuIcon) {
      cardActuIcon.style.color = '#2e3a59';
      cardActuIcon.classList.add('ri-heart-line');
      cardActuIcon.classList.remove('ri-heart-fill');
    }
  }
}
