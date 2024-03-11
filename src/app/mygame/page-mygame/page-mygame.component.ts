import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-page-mygame',
  templateUrl: './page-mygame.component.html',
  styleUrls: ['./page-mygame.component.css']
})
export class PageMygameComponent implements OnInit{

  profileId: number|any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.profileId = this.route.snapshot.paramMap.get('id');

    console.log("Profil Public ID : ", this.profileId)

  }

}

