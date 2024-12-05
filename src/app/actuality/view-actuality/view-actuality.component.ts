import {Component, OnInit, Input, OnChanges, SimpleChanges, Renderer2, Output, EventEmitter} from '@angular/core';
import { UserInterface } from "../../-interface/user.interface";
import { AppComponent } from "../../app.component";
import { PostActuService } from "../../-service/post-actu.service";
import { PostActuInterface } from "../../-interface/post-actu.interface";
import Swal from "sweetalert2";
import { ProviderInterface } from 'src/app/-interface/provider.interface';

@Component({
  selector: 'app-view-actuality',
  templateUrl: './view-actuality.component.html',
  styleUrls: ['./view-actuality.component.css']
})
export class ViewActualityComponent implements OnInit, OnChanges {

  @Input()
  public providerIdSelected: number | null = null;

  @Input()
  providerFollowed: ProviderInterface[] = []

  @Output()
  providerNbActu = new EventEmitter<number> ;

  @Output()
  providerFollowActuAll: EventEmitter<PostActuInterface[]> = new EventEmitter<PostActuInterface[]>()

  constructor(
    private app: AppComponent,
    private postActuService: PostActuService,
    private renderer: Renderer2
  ) {}

  isLogIn: boolean | undefined;
  userConnected: UserInterface | undefined;

  postActuAll: PostActuInterface[] = [];
  postActuProvider: PostActuInterface[] = [];
  postActuFollow: PostActuInterface[] = []

  ngOnInit(): void {
    this.isLogIn = this.app.isLoggedIn;
    this.userConnected = this.app.userConnected;

    if (!this.providerIdSelected){
      if (this.isLogIn) {
        this.getActuByFollow();
      } else {
        this.getActuAll()
      }
    } else {
      this.getActuByProvider(this.providerIdSelected);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['providerIdSelected']) {
      const currentValue = changes['providerIdSelected'].currentValue;
      const previousValue = changes['providerIdSelected'].previousValue;
      const providerAll = document.querySelectorAll('.provider-img');
  
      if (previousValue) {
        const lastProviderSelected = document.querySelector(`#provider${previousValue}`);
        if (lastProviderSelected) {
          providerAll.forEach(provider => {
            this.renderer.removeClass(provider, 'provider-inactive');
          });
        }
      }
  
      if (currentValue) {
        const providerSelected = document.querySelector(`#provider${currentValue}`);
        if (providerSelected) {
          providerAll.forEach(provider => {
            this.renderer.addClass(provider, 'provider-inactive');
          });
          this.renderer.removeClass(providerSelected, 'provider-inactive');
        }
        this.getActuByProvider(currentValue);
      } else {
        this.getActuAll();
      }
    }

    if (changes['providerFollowed']) {
      if (this.isLogIn && !this.providerIdSelected) {
        this.getActuByFollow();
      }
    }
  }

  /* RECUPERE TOUTE LES ACTU */
  getActuAll() {
    this.postActuService.getActuAll(this.app.setURL()).subscribe(responseActu => {
      if (responseActu.message === 'good') {
        /*GET ACTU ALL*/
        this.postActuAll = responseActu.result;

      } else {
        Swal.fire({
          title: 'Erreur!',
          text: 'Erreur de récupération des actualités',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.userConnected?.themeColor
        })
      }
    }, error => { this.app.erreurSubcribe() });
  }

  /* RECUPERE LES ACTU D'UN PROVIDER */
  getActuByProvider(id: number) {
    this.postActuService.getPostByProvider(id, this.app.setURL()).subscribe(response => {
      if (response.message === 'good') {
        /*GET ACTU BY PROVIDER*/
        this.postActuProvider = response.result;

        // ENVOIE LE NOMBRE D'ACTU AU PROVIDER
        const actuNbr = this.postActuProvider.length;
        this.providerNbActu.emit(actuNbr);
      }
    }, error => { this.app.erreurSubcribe() });
  }

  /* RECUPERE LES ACTU DES PROVIDERS SUIVIENT UNIQUEMENT */
  getActuByFollow() {
    this.postActuFollow = [];
  
    this.providerFollowed.forEach(provider => {
      this.postActuService.getPostByProvider(provider.id, this.app.setURL()).subscribe(
        response => {
          if (response.message === 'good') {
            this.postActuFollow.push(...response.result);
          }
        }
      );
    });
    this.providerFollowActuAll.emit(this.postActuFollow)
  }

  /*
  *
  * GENERATE VIEW
  *
  * */

  ActuAll(): PostActuInterface[]{
    /* AJOUTER DES FILTRE*/
    return this.postActuAll;
  }

  ActuByProvider(): PostActuInterface[] {
    /* AJOUTER DES FILTRE */
    return this.postActuProvider;
  }

  ActuByFollow(): PostActuInterface[] {
    // Si aucun provider suivi, reset par défaut en affichant tout les providers
    if (this.postActuFollow.length === 0) {
      return this.postActuAll
    }
    return this.postActuFollow
  }



}
