import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-page-mygame',
  templateUrl: './page-mygame.component.html',
  styleUrls: ['./page-mygame.component.css']
})
export class PageMygameComponent implements OnInit{

  profileId: number|any;
  noAccount: boolean = false;
  task:string | any;

  constructor(private route: ActivatedRoute,
              private app: AppComponent) { }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');
    this.task = this.route.snapshot.paramMap.get('task');

    if (!this.profileId && !this.app.isLoggedIn){
      this.noAccount = true;
    }

  }
}

