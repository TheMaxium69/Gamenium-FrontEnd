import {AfterContentInit, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../-service/game.service";
import {AppComponent} from "../../app.component";
import {GameInterface} from "../../-interface/game.interface";
import {HistoryMyGameService} from "../../-service/history-my-game.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-detail-game',
  templateUrl: './detail-game.component.html',
  styleUrls: ['./detail-game.component.css']
})
export class DetailGameComponent implements OnInit, AfterViewInit{

  isLoggedIn:boolean = false;
  userConnectedId:number|undefined;
  userName: string|undefined;
  userColor : string | undefined;
  isHovered: boolean = false;

  gameId: number|any;
  gameSelected: GameInterface|undefined;
  noneGame: boolean = false;

  mouseDown: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private app: AppComponent,
    private histoireMyGameService: HistoryMyGameService
  ) {
  }

  ngOnInit(): void {

    this.gameId = this.route.snapshot.paramMap.get('id');

    this.getGameById(this.gameId)

    this.isLoggedIn = this.app.isLoggedIn;

    if (this.isLoggedIn){

      this.userConnectedId = this.app.userConnected.id;
      this.userName = this.app.userConnected.username;
      this.userColor = this.app.userConnected.themeColor;

    }

  }

  getGameById(id:number){

    this.gameService.getGameById(id, this.app.setURL()).subscribe((reponseGameOne) => {

      if (reponseGameOne.message == "good"){

        this.gameSelected = reponseGameOne.result

        console.log(this?.gameSelected?.image)
        console.log("image tags :" + this?.gameSelected?.imageTags)


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
    if (!this.userName) return '';
    return this.userName.charAt(0).toUpperCase() + this.userName.slice(1) + ", ";
  }
  
  onHover(state:boolean) {
    this.isHovered = state;
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
    }

  }

  stopDrag(): void {
    console.log('drag stop') // A SUPPRIMER
    this.mouseDown = false;
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
