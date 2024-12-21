import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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
  currentUrl: string | any;

  constructor(private route: ActivatedRoute,
              private app: AppComponent,
              private router: Router) { }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');
    this.task = this.route.snapshot.paramMap.get('task');
    this.currentUrl = this.router.url;


    if (!this.profileId && !this.app.isLoggedIn){
      this.noAccount = true;
    }

    if (!this.app.isLoggedIn){
      this.router.navigate(['/account']);
    }

    if (!this.app.isAccess){
      this.router.navigate(['/waiting']);
    }
  }
}

