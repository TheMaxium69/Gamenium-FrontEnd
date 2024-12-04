import {AfterContentInit, AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../-service/game.service";
import {AppComponent} from "../../app.component";
import {GameInterface} from "../../-interface/game.interface";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {NgForm} from "@angular/forms";
import { HistoryMyGameInterface } from 'src/app/-interface/history-my-game.interface';

@Component({
  selector: 'app-detail-game',
  templateUrl: './detail-game.component.html',
  styleUrls: ['./detail-game.component.css']
})
export class DetailGameComponent implements OnInit, AfterViewInit{

  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  hasGameInCollection : boolean = false;

  isLoggedIn:boolean = false;
  userConnectedId: number = 0;
  displayName: string|undefined;
  userName: string = "";
  userColor : string | undefined;
  isHovered: boolean = false;

  gameId: number|any;
  gameSelected: GameInterface|undefined;
  noneGame: boolean = false;

  mouseDown: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  showBackToTop = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    protected app: AppComponent,
    private histoireMyGameService: HistoryMyGameService
  ) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');

    this.getGameById(this.gameId)

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn){

      this.userConnectedId = this.app.userConnected.id;
      this.myGameByUser(this.userConnectedId);
      this.displayName = this.app.userConnected.displayname;
      this.userName = this.app.userConnected.userName;
      this.userColor = this.app.userConnected.themeColor;
    }

  }

  getGameById(id:number){

    this.gameService.getGameById(id, this.app.setURL()).subscribe((reponseGameOne) => {

      if (reponseGameOne.message == "good"){

        this.gameSelected = reponseGameOne.result

      } else {

        this.noneGame = true;

      }


    });
  }

  addGame(form:NgForm) {

    let is_pinned = form.value['pinnedGame'];
    if (is_pinned == ""){
      is_pinned = false;
    }

    let bodyNoJsonMyGame: any = {
          "id_game":this.gameSelected?.id,
          "is_pinned":is_pinned,
    };


    const bodyMyGame = JSON.stringify(bodyNoJsonMyGame);

    this.histoireMyGameService.postMyGame(bodyMyGame, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyGameAdd => {

      if(reponseMyGameAdd.message == "add game is collection"){
        console.log(this.gameSelected?.name, " à été ajouter");
      } else {
        console.log("erreur message");
      }

    })

  }

  get capitalizedUserName(): string {
    if (!this.displayName) return "";
    return this.displayName.charAt(0).toUpperCase() + this.displayName.slice(1) + ", ";
  }

  myGameByUser(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
        this.hasGameInCollection = this.checkHasGameInCollection(Number(this.gameId));
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
    });
  }

  checkHasGameInCollection(gameId: number): boolean {
    if (!this.myGameHistoriqueAll || this.myGameHistoriqueAll.length === 0) {
      return false;
    }

    for (let entry of this.myGameHistoriqueAll) {
      if (entry.myGame?.game?.id === gameId) {
        return true;
      }
    }

    return false;

  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showBackToTop = scrollPosition > 800;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ////////////////////////////// Initialisation après l'initialisation du DOM pour que le carroussel fonctionne  /////////////////////

  ngAfterViewInit() {
    const prev = document.querySelector<HTMLDivElement>("#prev");
    const next = document.querySelector<HTMLDivElement>("#next");
    const carouselVp = document.querySelector<HTMLDivElement>("#carousel-vp");
    let cCarouselInner = document.querySelector<HTMLDivElement>("#cCarousel-inner");
    const slider = document.querySelector('.provider-card-container') as HTMLElement;

    if (slider) {
      console.log('Container Width:', slider.offsetWidth);
      console.log('Scroll Width:', slider.scrollWidth);
    }

    if (!carouselVp || !prev || !next) {
      console.error("Un ou plusieurs éléments du carrousel sont null.");
      return;
    }

    let carouselInnerWidth = 0;
    let leftValue = 0;

    const totalMovementSize = parseFloat(document.querySelector<HTMLDivElement>(".cCarousel-item")?.getBoundingClientRect().width?.toString() || "0") +
      parseFloat(window.getComputedStyle(cCarouselInner!).getPropertyValue("gap"));

    const initializeCarousel = () => {
      cCarouselInner = document.querySelector<HTMLDivElement>("#cCarousel-inner");

      if (!cCarouselInner) {
        console.error("L'élément cCarouselInner est null.");
        return;
      }

      carouselInnerWidth = cCarouselInner.getBoundingClientRect().width;

      prev?.addEventListener("click", () => {
        if (leftValue !== 0) {
          leftValue -= -totalMovementSize;
          cCarouselInner!.style.left = leftValue + "px";
        }
      });

      next?.addEventListener("click", () => {
        const carouselVpWidth = carouselVp.getBoundingClientRect().width;
        if (carouselInnerWidth - Math.abs(leftValue) > carouselVpWidth) {
          leftValue -= totalMovementSize;
          cCarouselInner!.style.left = leftValue + "px";
        }
      });
    };

    setTimeout(initializeCarousel, 0);

    const mediaQuery510 = window.matchMedia("(max-width: 510px)");
    const mediaQuery770 = window.matchMedia("(max-width: 770px)");

    mediaQuery510.addEventListener("change", mediaManagement);
    mediaQuery770.addEventListener("change", mediaManagement);

    let oldViewportWidth = window.innerWidth;

    function mediaManagement() {
      const newViewportWidth = window.innerWidth;

      if (leftValue <= -totalMovementSize && oldViewportWidth < newViewportWidth) {
        leftValue += totalMovementSize;
        cCarouselInner!.style.left = leftValue + "px";
        oldViewportWidth = newViewportWidth;
      } else if (leftValue <= -totalMovementSize && oldViewportWidth > newViewportWidth) {
        leftValue -= totalMovementSize;
        cCarouselInner!.style.left = leftValue + "px";
        oldViewportWidth = newViewportWidth;
      }
    }
  }

  // Drag carousel provider cards
  startDrag(mouse: MouseEvent): void {
    console.log('drag start') // A SUPPRIMER
    const slider = document.querySelector('.provider-card-container') as HTMLElement;

    if (slider) {
      this.mouseDown = true;
      this.startX = mouse.pageX - slider.offsetLeft;
      this.scrollLeft = slider.scrollLeft;

      slider.classList.add('no-select');
    }

  }

  stopDrag(): void {
    console.log('drag stop') // A SUPPRIMER
    const slider = document.querySelector('.provider-card-container') as HTMLElement;
    this.mouseDown = false;

    if (slider) {
      slider.classList.remove('no-select');
    }

    document.body.classList.remove('no-select');
  }

  move(mouse: MouseEvent): void {

    if (!this.mouseDown) {
      return;
    }

    console.log('drag en cours') // A SUPPRIMER
    const slider = document.querySelector('.provider-card-container') as HTMLElement;

    mouse.stopPropagation();

    if (slider) {
      const x = mouse.pageX - slider.offsetLeft;
      const scroll = x - this.startX;
      slider.scrollLeft = this.scrollLeft - scroll;
    }

  }

  setModal(){
    this.app.gameSelected = this.gameSelected;
  }


}
