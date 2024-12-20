import {Component, OnInit} from '@angular/core';
import {UserInterface} from "../../-interface/user.interface";
import {ProfilInterface} from "../../-interface/profil.interface";
import {BadgeInterface} from "../../-interface/badge.interface";
import {ActivatedRoute} from "@angular/router";
import {AppComponent} from "../../app.component";
import {ProfilService} from "../../-service/profil.service";
import {BadgeService} from "../../-service/badge.service";
import { GameInterface } from 'src/app/-interface/game.interface';
import { TaskUserInterface } from 'src/app/-interface/task-user.interface';
import { TaskService } from 'src/app/-service/task.service';
import { TaskUserCompletedInterface } from 'src/app/-interface/task-user-completed.interface';
import { CommentService } from 'src/app/-service/comment.service';
import { LikeService } from 'src/app/-service/like.service';
import { ApicallInterface } from 'src/app/-interface/apicall.interface';
import { HistoryMyGameInterface } from 'src/app/-interface/history-my-game.interface';
import { PostActuService } from 'src/app/-service/post-actu.service';
import { PostActuInterface } from 'src/app/-interface/post-actu.interface';
import { GameService } from 'src/app/-service/game.service';
import { ProviderService } from 'src/app/-service/provider.service';
import { ProviderInterface } from 'src/app/-interface/provider.interface';

@Component({
  selector: 'app-home-connected',
  templateUrl: './home-connected.component.html',
  styleUrls: ['./home-connected.component.css']
})
export class HomeConnectedComponent implements OnInit {

  profileId: number|any;
  userConnected: UserInterface | undefined;
  profilSelected: ProfilInterface | undefined;
  badgeUserConnected: BadgeInterface[] | undefined;
  isYourProfil:boolean = false;
  postActuFollowOrAll: PostActuInterface[] = [];
  games: GameInterface[] = [];
  searchValue: string = ''


  isColor:string = this.app.colorDefault;
  isPp: string | undefined;

  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
  gameSelected: GameInterface | undefined;
  task: string | any;
  // tableau des taches avec leur statu de complétion
  tasks: (TaskUserInterface & { completed: boolean})[] = [];
  // progression de la barre de progression
  progress: number = 0;

  // Indicateur pour savoir quand les données sont bien chargées
  profileLoaded: boolean = false;
  gamesLoaded: boolean = false;
  tasksLoaded: boolean = false;
  userLikesLoaded: boolean = false;
  userCommentsLoaded: boolean = false;

  // Stock les likes et commentaire ( surement a delete après )
  userLikes:any[] = [];
  userComments:any[]= [];

  // Provider
  providers: ProviderInterface[] = []
  randomProviders: ProviderInterface[] = [];
  unfollowedProviders: ProviderInterface[] = [];
  followedStates: { [id: number]: boolean } = {}

  constructor(private route: ActivatedRoute,
              protected app:AppComponent,
              private taskService: TaskService,
              private commentService: CommentService,
              private likeService: LikeService,
              private profileService:ProfilService,
              private postActuService: PostActuService,
              private gameService: GameService,
              private badgeService: BadgeService,
              private providerService: ProviderService)
              { }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');
    this.userConnected = this.app.userConnected;

    if (!this.profileId){
      this.profileId = this.userConnected?.id
    } else if (this.profileId == this.userConnected?.id){
      this.isYourProfil = true
    }


    this.getInfoProfile(this.profileId);
    this.getBadgeByUser(this.profileId);
    this.fetchTasks();
    this.getActuAll();
    this.getLatestGames(3);
    this.fetchProviders();



  }

  getInfoProfile(id:number){

    this.profileService.getProfilByUserId(id,this.app.setURL(), this.app.createCorsToken()).subscribe(responseProfil => {

      if (responseProfil.message == "good"){

        this.profilSelected = responseProfil.result;

        if (this.profilSelected?.themeColor){
          this.isColor = this.profilSelected.themeColor;
        }

        // if (this.profilSelected?.picture){
        //   this.isPp = this.profilSelected.picture.url;
        // }

      } else {

        console.log("err user not existing");

      }

    });

  }

  getBadgeByUser(id: number): void {
    this.badgeService.getBadgeByUser(id, this.app.setURL(), this.app.createCorsToken()).subscribe((ReponseApi) => {
      if (ReponseApi.message == 'good') {
        this.badgeUserConnected = ReponseApi.result;
      }
    });
  }

  extractFirstLetter(str: string|any): string {
    return str.charAt(0);
  }

   //Récupère les tâches depuis le backend et met à jour leur statut de complétion.
   fetchTasks(): void {
    const options = this.app.createCorsToken();

    // Récupère toutes les tâches
    this.taskService.getAllTasks(this.app.setURL(), this.app.createCorsToken()).subscribe((allTasksResponse) => {
      if (allTasksResponse.message === 'good') {
        const allTasks: TaskUserInterface[] = allTasksResponse.result;

        // Récupère les tâches complétées
        this.taskService.getCompletedTasks(this.app.setURL(), options).subscribe((completedResponse) => {
          let completedTasks: TaskUserCompletedInterface[] = [];

          if (completedResponse.message === 'good') {
            completedTasks = completedResponse.result;
          } else if (completedResponse.message === 'Aucune tâche complétée trouvée') {
            completedTasks = []; // Pas de tâches complétées
          } else {
            console.error('Erreur lors de la récupération des tâches complétées:', completedResponse.message);
            return; // Quitter si c'est une véritable erreur
          }

          // Map les tâches et marque comme complétées si elles le sont
          this.tasks = allTasks.map((task: TaskUserInterface) => {
            const isCompleted = completedTasks.some(
            (completed: TaskUserCompletedInterface) => completed.task_id === task.id
          );

            return { ...task, completed: isCompleted };
          });

          // Mise à jour de la barre de progression
          this.updateProgressBar();


          // on passe les tache chargé a true et on vérifie les tache complété
          this.tasksLoaded = true;
          this.loadUserLikesAndComments();

        }, (error) => {
          console.error('Erreur lors de la récupération des tâches complétées:', error);
        });
      } else {
        console.error('Échec de la récupération de toutes les tâches:', allTasksResponse.message);
      }
    }, (error) => {
      console.error('Erreur lors de la récupération de toutes les tâches:', error);
    });
  }

  // Charge les like et commentaire
  loadUserLikesAndComments(): void{
    const options = this.app.createCorsToken();

    this.likeService.getLikesByUser(this.app.setURL(), options).subscribe(
      (response: ApicallInterface) => {
        if (response.message === "good"){
          this.userLikes = response.result;
        } else {
          console.error ("Erreur lors de la récup des likes", response.message);
        }
        this.userLikesLoaded = true;
        this.tryCheckAndCompleteTasks();
      },
      (error) => {
        console.error("Erreur lors de l'appelle GetLikesByUser", error);
        this.userLikesLoaded = true;
        this.tryCheckAndCompleteTasks();
      }
    );

    this.commentService.getCommentsByUser(this.app.setURL(), options).subscribe(
      (response: ApicallInterface) => {
        if (response.message === "good"){
          this.userComments = response.result;
        } else {
          console.error ("Erreur lors de la récup des commentaires", response.message);
        }
        this.userCommentsLoaded = true;
        this.tryCheckAndCompleteTasks();
      },
      (error) => {
        console.error("Erreur lors de l'appelle GetLikesByUser", error);
        this.userCommentsLoaded = true;
        this.tryCheckAndCompleteTasks();
      }
    );
  }

  tryCheckAndCompleteTasks(): void {
    if (this.profileLoaded && this.gamesLoaded && this.tasksLoaded && this.userLikesLoaded && this.userCommentsLoaded) {
      this.checkAndCompleteTasks();
    }
  }

  // Vérifie les conditions pour chaque tâche incomplète et les marque comme complétées si nécessaire.
  checkAndCompleteTasks(): void {
    this.tasks.forEach(task => {
      if (!task.completed) {
        if (task.id === 3 && this.myGameHistoriqueAll && this.myGameHistoriqueAll.length > 0) {
          this.completeTask(task.id);
        }
        if (task.id === 2 && this.isPp) {
          this.completeTask(task.id);
        }
        if (task.id === 4 && this.userLikes && this.userLikes.length > 0) {
          this.completeTask(task.id);
        }
        if (task.id === 5 && this.userComments && this.userComments.length > 0) {
          this.completeTask(task.id);
        }
        // Si nouvelle task ajouter la verif ici
      }
    });
  }

  //Met à jour la barre de progression en fonction des tâches complétées.

  updateProgressBar(): void {
    const completedTasks = this.tasks.filter((task) => task.completed).length;
    this.progress = (completedTasks / this.tasks.length) * 100;

  }

  completeTask(taskId: number): void {
    const body = JSON.stringify({ taskId });
    const options = this.app.createCorsToken();

    this.taskService.postCompleteTask(body, this.app.setURL(), options).subscribe((response) => {
      if (response.message === 'Tâche complétée') {
        // Met à jour le statut de la tâche dans le tableau local
        this.tasks = this.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        );
        this.updateProgressBar(); // Recalculer la progression

      } else {
        console.error('Erreur lors de la complétion de la tâche :', response.message);
      }
    }, (error) => {
      console.error('Erreur lors de la requête completeTask :', error);
    });
  }

  unsetModal(){
    this.app.gameSelected = undefined;
  }

  getActuAll() {
    console.log('Fetching all actualities');
    this.postActuService.getActuAll(this.app.setURL(), this.app.createCorsToken()).subscribe(responseActu => {
      if (responseActu.message === 'good') {
        this.postActuFollowOrAll = responseActu.result;
      } else {
        console.log("failed fetching")
      }
    });
  }

  // getGames() {
  //   console.log('Fetching games');
  //   this.gameService.searchGames(this.searchValue, 100, this.app.setURL()).subscribe((results) => {
  //     this.games = results;
  //   });
  // }

  // PROVIDER

  fetchProviders(): void {
    this.providerService.getAllProviders(this.app.setURL(), this.app.createCorsToken()).subscribe({
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
    const shuffled = [...this.providers].sort(() => 0.5 - Math.random());
    this.randomProviders = shuffled.slice(0, count);
  }


  getLatestGames(limit: number){

    let bodyNoJson = {
      "limit": limit,
    }

    let body = JSON.stringify(bodyNoJson);

    console.log('Fetching latest games');
    this.gameService.getLatestGames(body, this.app.setURL(), this.app.createCorsToken()).subscribe((results) => {
      this.games = results.result;
      console.log(results.result)
    })
  }

}
