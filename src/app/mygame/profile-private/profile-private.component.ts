import { Component, OnInit, Renderer2 } from '@angular/core';
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

@Component({
  selector: 'app-profile-private',
  templateUrl: './profile-private.component.html',
  styleUrls: ['./profile-private.component.css']
})
export class ProfilePrivateComponent implements OnInit {

  userConnected: UserInterface | undefined;
  myGameHistoriqueAll: HistoryMyGameInterface[] | undefined;
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


  constructor(private app: AppComponent,
              private taskService: TaskService,
              private commentService: CommentService,
              private likeService: LikeService,
              private myGameService: GameService,
              private userRateService: UserRateService,
              private profileService: ProfilService,
              private route: ActivatedRoute,
              private histoireMyGameService: HistoryMyGameService,
              private renderer: Renderer2,
              private router: Router) { }


  ngOnInit(): void {
    this.task = this.route.snapshot.paramMap.get('task');
    this.userConnected = this.app.userConnected;

    if (this.userConnected) {
      this.myGameByUser(this.userConnected.id);
      this.getInfoProfile(this.userConnected.id);
      this.fetchTasks();
    }


  }

  // récup des jeux par utilisateur
  myGameByUser(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame: { message: string; result: HistoryMyGameInterface[] | undefined; }) => {
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
        console.log(this.myGameHistoriqueAll);
      } else {
        console.log("pas de jeux trouvé pour l'utilisateur")
      }
      // on pase le gamesloaded a true et on appelle la method qui vérifie les taches complétés
      this.gamesLoaded = true;
      this.tryCheckAndCompleteTasks();
    });

    this.userRateService.getRateByUser(id_user, this.app.setURL()).subscribe(responseRates => {
      if (responseRates.message == "good") {
        this.userRatingAll = responseRates.result;
      }
    });
  }

  // on vérifie si l'utilisateur à noté un jeux spécifique
  hasUserRatings(game_id: any): boolean {
    if (this.userRatingAll) {
      for (let userRating of this.userRatingAll) {
        if (userRating.game.id === game_id) {
          return true;
        }
      }
      return false;
    } else {
      return false
    }
  }

  /* VERIF SI IL Y A DES JEUX EPINGLES */
  hasPinnedGames(): boolean {
    return this.myGameHistoriqueAll?.some(game => game.myGame.is_pinned) ?? false;
  }

/* OBTENIR LES JEUX EPINGLES */
getPinnedGames(): HistoryMyGameInterface[] {
  return this.myGameHistoriqueAll?.filter(game => game.myGame.is_pinned) ?? [];
}

/* OBTENIR LES JEUX NON EPINGLES */
getUnpinnedGames(): HistoryMyGameInterface[] {
  // selon si une recherche existe ou non on renvoie une liste différente
  if (this.searchQuery) {
    // ici les jeux filtré selon la recherche
    return this.filteredGames ?? [];
    
  } else {
    // ici les jeux non épinglés
    return this.myGameHistoriqueAll?.filter(game => !game.myGame.is_pinned) ?? [];
  }
}


  /* METHOD DU TOGGLE SUR BUTTON EPINGLE */
  togglePin(myGameHistorique: HistoryMyGameInterface) {
    // maj du pin localement
    myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;

    // Préparer le corps de la requête
    const body = JSON.stringify({
      id_game: myGameHistorique.myGame.game.id,
      is_pinned: myGameHistorique.myGame.is_pinned,
    });

    // Envoyer la requête au backend pour mettre à jour le statut is_pinned
    this.histoireMyGameService.updatePinMyGame(body, this.app.setURL(), this.app.createCorsToken())
      .subscribe(response => {
        if (response.message === 'game is pinned') {
          console.log('Statut épinglé mis à jour dans la base de données');
        } else {
          console.error('Échec de la mise à jour du statut épinglé :', response.message);
          // En cas d'erreur, on rétablit l'ancien statut
          myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
        }
      }, error => {
        console.error('Erreur lors de la mise à jour du statut épinglé :', error);
        // En cas d'erreur, on rétablit l'ancien statut
        myGameHistorique.myGame.is_pinned = !myGameHistorique.myGame.is_pinned;
      });
  }

  existingPinned(): boolean {
    if (this.myGameHistoriqueAll) {
      for (let myGame of this.myGameHistoriqueAll) {
        if (myGame.myGame.is_pinned) {
          return true;
        }
      }
      return false;
    } else {
      return false
    }
  }

  selectViewMyGame(historyMyGameInterface: HistoryMyGameInterface) {
    this.app.viewMyGame = historyMyGameInterface;
    console.log("MyGame sélectionné avec l'ID :", historyMyGameInterface.id);
  }

  unselectViewMyGame() {
    this.app.viewMyGame = undefined;
  }

  // Recherche de jeux 
  filterGames(): void {
    if (!this.myGameHistoriqueAll) return;
  
    const query = this.searchQuery.toLowerCase();
    this.filteredGames = this.myGameHistoriqueAll.filter((game) => {
      // on fais une requete pour rechercher les jeux qui corresponde a la searchQuery
      const gameName = game.myGame?.game?.name?.toLowerCase() || '';
      const platforms = game.myGame?.game?.platforms?.map(p => p.name?.toLowerCase()).join(', ') || '';
      const year = game.myGame?.game?.expectedReleaseYear?.toString() || ''; 
  
      
      return (
        // on return les resultat qui corresponde
        gameName.includes(query) ||
        platforms.includes(query) ||
        year.includes(query)
      );
    });
  }
  
  


  gameSelected: GameInterface | undefined;

  selectGame(game: GameInterface) {
    this.gameSelected = game;
    console.log("Jeu sélectionné avec l'ID :", game.id);
  }

  unselectGame() {
    this.gameSelected = undefined;
  }

  myGameByUserAfterAddGame(id_user: number): void {
    this.histoireMyGameService.getMyGameByUser(id_user, this.app.setURL()).subscribe((responseMyGame) => {
      if (responseMyGame.message == "good") {
        this.myGameHistoriqueAll = responseMyGame.result;
      } else {
        console.log("Pas de jeux trouvés pour l'utilisateur");
      }
      // Après avoir rechargé les jeux, réévaluer les tâches
      this.checkAndCompleteTasks();
    });
  }

  deleteFromMyGame(gameId: number) {
    console.log(gameId)
  }

  addNote(form: NgForm) {
    console.log(form.value);
    if (form.value['noteGame'] >= 0 && form.value['noteGame'] <= 20) {
      let noteGame = form.value['noteGame'];
      let bodyNoJsonMyGameNote: any = {
        "id_game": this.gameSelected?.id,
        "note": noteGame,
      };
      const bodyMyGameNote = JSON.stringify(bodyNoJsonMyGameNote);
      this.histoireMyGameService.postNoteMyGame(bodyMyGameNote, this.app.setURL(), this.app.createCorsToken()).subscribe(reponseMyGameNoteAdd => {
        if (reponseMyGameNoteAdd.message == "add note is game") {
          console.log("note ajoutée")
          let noteSpanGame = document.getElementById("noteGame" + this.gameSelected?.id)
          if (noteSpanGame) {
            noteSpanGame.innerHTML = noteGame;
          }
          const inputNote: HTMLElement | null = document.getElementById('inputNote');
          if (inputNote) {
            this.renderer.setProperty(inputNote, 'value', '');
          }
          // Actualiser la liste des notes après l'ajout
          if (this.userConnected) {
            this.myGameByUser(this.userConnected.id);
          }
        } else {
          console.log(reponseMyGameNoteAdd);
        }
      });
    } else {
      console.log("note invalide");
    }
  }
  // récupere les info du profil de l'utilisateur
  getInfoProfile(id: number) {
    this.profileService.getProfilByUserId(id, this.app.setURL()).subscribe(responseProfil => {
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

  // Méthode pour effectuer la recherche de jeux
  onSubmitSearch(form: NgForm): void {
    const searchValue = form.value['searchValue'];
    this.myGameService.searchGames(searchValue, 5, this.app.setURL()).subscribe(
      (results: GameInterface[]) => {
        this.searchResults = results;
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la recherche de jeux :', error);
      }
    );
  }

  goToGame(gameId: number): void {
    this.router.navigate(['/game', gameId]);
  }

  // ********* Gestion des tâches ********* //

  //Récupère les tâches depuis le backend et met à jour leur statut de complétion.
  fetchTasks(): void {
    const options = this.app.createCorsToken();

    // Récupère toutes les tâches
    this.taskService.getAllTasks(this.app.setURL()).subscribe((allTasksResponse) => {
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
      if (task.name === 'Link Game' && this.myGameHistoriqueAll && this.myGameHistoriqueAll.length > 0) {
        this.completeTask(task.id);
      }
      if (task.name === 'Profil Picture' && this.isPp) {
        this.completeTask(task.id);
      }
      if (task.name === 'Liker votre premier article' && this.userLikes && this.userLikes.length > 0) {
        this.completeTask(task.id);
      }
      if (task.name === 'Mettez votre premier commentaire ' && this.userComments && this.userComments.length > 0) {
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

  setModal(game: GameInterface){
    this.app.gameSelected = game;
  }

  unsetModal(){
    this.app.gameSelected = undefined;
  }

}

