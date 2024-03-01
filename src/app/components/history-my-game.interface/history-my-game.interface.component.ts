import { Component, OnInit } from '@angular/core';
import { HistoryMyGameService } from '../../-service/history-my-game.service';
import { HistoryMyGameInterface } from '../../-interface/history-my-game.interface';

@Component({
  selector: 'app-history-my-game',
  templateUrl: './history-my-game.interface.component.html',
  styleUrls: ['./history-my-game.interface.component.css'],
})
export class HistoryMyGameInterfaceComponent implements OnInit {
  historyMyGames: HistoryMyGameInterface[] = [];

  constructor(private HistoryMyGameService: HistoryMyGameService) {}

  ngOnInit(): void {
    this.getAllHistoryMyGames();
  }

  getAllHistoryMyGames(): void {
    this.HistoryMyGameService.getAllHistoryMyGames().subscribe((historyMyGames) => {
      this.historyMyGames = historyMyGames;
    });
  }
}
