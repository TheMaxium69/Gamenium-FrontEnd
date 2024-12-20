import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AppComponent } from '../../app.component';
import { HistoryMyGameService } from "../../-service/history-my-game.service";
import { UserInterface } from "../../-interface/user.interface";
import { HistoryMyGameInterface } from "../../-interface/history-my-game.interface";
import { UserRateService } from "../../-service/user-rate.service";
import { UserRateInterface } from "../../-interface/user-rate.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { GameInterface } from "../../-interface/game.interface";
import { ProfilInterface } from "../../-interface/profil.interface";
import { ProfilService } from "../../-service/profil.service";
import { GameService } from 'src/app/-service/game.service';
import { TaskUserInterface } from 'src/app/-interface/task-user.interface';
import { TaskService } from 'src/app/-service/task.service';
import { HttpHeaders } from '@angular/common/http';
import { TaskUserCompletedInterface } from 'src/app/-interface/task-user-completed.interface';
import { CommentService } from 'src/app/-service/comment.service';
import { LikeService } from 'src/app/-service/like.service';
import { ApicallInterface } from 'src/app/-interface/apicall.interface';
import {PlateformService} from "../../-service/plateform.service";
import {PlateformInterface} from "../../-interface/plateform.interface";

@Component({
  selector: 'app-profile-private',
  templateUrl: './profile-private.component.html',
  styleUrls: ['./profile-private.component.css']
})
export class ProfilePrivateComponent implements OnInit {

  userConnected: UserInterface | undefined;
  userRatingAll: UserRateInterface[] | undefined;
  task: string | any;
  // tableau des taches avec leur statu de complétion
  tasks: (TaskUserInterface & { completed: boolean})[] = [];
  // progression de la barre de progression
  progress: number = 0;
  searchResults: GameInterface[] | undefined;
  searchValue: string = '';
  isColor: string = this.app.colorDefault;
  isPp: string | undefined;
  profilSelected: ProfilInterface | undefined;
  plateformsUser: PlateformInterface[] | undefined;

  // Indicateur pour savoir quand les données sont bien chargées
  profileLoaded: boolean = false;
  gamesLoaded: boolean = false;
  tasksLoaded: boolean = false;
  userLikesLoaded: boolean = false;
  userCommentsLoaded: boolean = false;

  // Stock les likes et commentaire ( surement a delete après )
  userLikes:any[] = [];
  userComments:any[]= [];

  // Pour la recherche
  searchQuery: string = '';
  filteredGames: HistoryMyGameInterface[] = []; // liste des jeux filtré
  sortOption: string = ''; // Tri par défaut
  isFilterDropdownOpen: boolean = false; // Control la visibilité du dropdown

  isLoading:boolean = true

  // Pour le responsive de la tabGame
  innerWidth: number = window.innerWidth;
  classContainer: string = "container";

  constructor(protected app: AppComponent,
              private taskService: TaskService,
              private commentService: CommentService,
              private likeService: LikeService,
              private myGameService: GameService,
              private userRateService: UserRateService,
              private profileService: ProfilService,
              private route: ActivatedRoute,
              private histoireMyGameService: HistoryMyGameService,
              private plateformService:PlateformService,
              private renderer: Renderer2,
              private router: Router) { }


  ngOnInit(): void {
    this.task = this.route.snapshot.paramMap.get('task');
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.myGameByUser(this.userConnected.id);
      this.getUserRate(this.userConnected.id);
      this.getInfoProfile(this.userConnected.id);
      this.fetchTasks();
    }

    // initialisation de la valeur classContainer pour responsive TabMyGame
    if (this.innerWidth <= 991) {
      this.classContainer = "container-fluid"
    } else {
      this.classContainer = "container"
    }


  }

  // responsive de tabMyGame
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 991) {
          this.classContainer = "container-fluid"
      } else {
          this.classContainer = "container"
        }
  }


  // récup des jeux par utilisateur
  myGameByUser(id_user: number): void {
    if (this.app.myGameAll){
      this.app.myGameAll = this.app.myGameAll?.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime());
      this.isLoading = false;
      this.gamesLoaded = true;
      this.tryCheckAndCompleteTasks();
    } else {
      this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL(), this.app.createCorsToken()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
        if (responseMyGame.message == "good") {
          this.app.myGameAll = responseMyGame.result?.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime());
        } else {
          console.log("pas de jeux trouvé pour l'utilisateur")
        }
        this.isLoading = false;
        this.gamesLoaded = true;
        this.tryCheckAndCompleteTasks();
      });
    }
  }

  getUserRate(id_user: number){
    if (this.app.userRatingAll){
      this.userRatingAll = this.app.userRatingAll;
    } else {
      this.userRateService.getRateByUser(id_user, this.app.setURL(), this.app.createCorsToken()).subscribe(responseRates => {
        if (responseRates.message == "good") {
          this.userRatingAll = responseRates.result;
          this.app.userRatingAll = this.userRatingAll;
        }
      });
    }
  }

  /* OBTENIR LES JEUX EPINGLES */
  getPinnedGames(): HistoryMyGameInterface[] {
    return this.app.myGameAll?.filter(game => game.myGame.is_pinned) ?? [];
  }

  /* OBTENIR LES JEUX NON EPINGLES */
  getUnpinnedGames(): HistoryMyGameInterface[] {
    if (this.searchQuery || this.isFilterApplied()) {
      // Si un filtre ou une recherche et appliqué on renvoie le tableau filtré
      return this.filteredGames ?? [];
    } else {
      // Sinon on renvoie les jeux unpin
      return this.app.myGameAll?.filter(game => !game.myGame.is_pinned) ?? [];
    }
  }

  filterGames(): void {
    if (!this.app.myGameAll) return;

    const query = this.searchQuery ? this.searchQuery.toLowerCase() : '';

    if (query) {
      // Si j'ai une query je recherche en fonction de la query
      this.filteredGames = this.app.myGameAll.filter((game) => {
        const gameName = game.myGame?.game?.name?.toLowerCase() || '';
        const platforms = game.myGame?.plateform?.name?.toLowerCase() || '';
        const year = game.myGame?.game?.expectedReleaseYear?.toString() || '';


        return (
          gameName.includes(query) ||
          platforms.includes(query) ||
          year.includes(query)
        );
      });
    } else {
      // Sinon je renvoie tout les jeux, pin et unpin
      this.filteredGames = [...this.app.myGameAll];
    }

    this.applySorting();
  }


  // récupere les info du profil de l'utilisateur
  getInfoProfile(id: number) {
    this.profileService.getProfilByUserId(id, this.app.setURL(), this.app.createCorsToken()).subscribe(responseProfil => {
      if (responseProfil.message == "good") {
        this.profilSelected = responseProfil.result;
        if (this.profilSelected?.themeColor) {
          this.isColor = this.profilSelected.themeColor;
        }
        if (this.profilSelected?.picture) {
          this.isPp = this.profilSelected.picture;
        }
      } else {
        console.log("Erreur : utilisateur non existant");
      }
      // On passe le profilLoaded à true et on appelle la méthode qui vérifie les tâches complétées
      this.profileLoaded = true;
      this.tryCheckAndCompleteTasks();
    }, error => {
      console.error('Erreur lors de la récupération du profil :', error);
      // Même en cas d'erreur, on passe le profilLoaded à true pour éviter de bloquer
      this.profileLoaded = true;
      this.tryCheckAndCompleteTasks();
    });
  }

  // Toogle le dropdown
  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  setSortOption(option: string): void {
    this.sortOption = option;
    this.filterGames();
    this.isFilterDropdownOpen = false; // Close dropdown after selection
  }

  //check si un filtre autre que celui par default est appliqué
  isFilterApplied(): boolean {
    return this.sortOption !== '';

  }

  applySorting(): void {
    if (!this.filteredGames) return;

    switch (this.sortOption) {
      case 'name-asc':
        this.filteredGames.sort((a, b) =>
          a.myGame?.game?.name?.localeCompare(b.myGame?.game?.name || '') || 0
        );
        break;

      case 'name-desc':
        this.filteredGames.sort((a, b) =>
          b.myGame?.game?.name?.localeCompare(a.myGame?.game?.name || '') || 0
        );
        break;

      case 'year-asc':
        this.filteredGames.sort((a, b) => {
          const dateA = a.myGame?.game?.originalReleaseDate
            ? new Date(a.myGame?.game?.originalReleaseDate).getTime()
            : 0;
          const dateB = b.myGame?.game?.originalReleaseDate
            ? new Date(b.myGame?.game?.originalReleaseDate).getTime()
            : 0;

          return dateA - dateB;
        });
        break;

      case 'year-desc':
        this.filteredGames.sort((a, b) => {
          const dateA = a.myGame?.game?.originalReleaseDate
            ? new Date(a.myGame?.game?.originalReleaseDate).getTime()
            : 0;
          const dateB = b.myGame?.game?.originalReleaseDate
            ? new Date(b.myGame?.game?.originalReleaseDate).getTime()
            : 0;

          return dateB - dateA;
        });
        break;
        case 'added-asc':
          this.filteredGames.sort((a, b) => new Date(a.myGame?.added_at).getTime() - new Date(b.myGame?.added_at).getTime());
          break;
        case 'added-desc':
          this.filteredGames.sort((a, b) => new Date(b.myGame?.added_at).getTime() - new Date(a.myGame?.added_at).getTime());
          break;

      default:
        break;
    }
  }

  // ********* Gestion des tâches ********* //

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
          if (this.progress !== 100){
            this.loadUserLikesAndComments();
          }

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


  //Vérifie si toutes les données sont chargées, puis vérifie les tâches.

    tryCheckAndCompleteTasks(): void {
      if (this.profileLoaded && this.gamesLoaded && this.tasksLoaded && this.userLikesLoaded && this.userCommentsLoaded) {
        this.checkAndCompleteTasks();
      }
    }

// Vérifie les conditions pour chaque tâche incomplète et les marque comme complétées si nécessaire.
checkAndCompleteTasks(): void {
  this.tasks.forEach(task => {
    if (!task.completed) {
      if (task.id === 3 && this.app.myGameAll && this.app.myGameAll.length > 0) {
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


  //Marque une tâche comme complétée en l'envoyant au backend.

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





}

