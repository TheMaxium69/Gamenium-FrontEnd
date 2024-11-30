import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {PostActuInterface} from "../../-interface/post-actu.interface";

@Component({
  selector: 'app-card-actu',
  templateUrl: './card-actu.component.html',
  styleUrls: ['./card-actu.component.css']
})
export class CardActuComponent implements OnInit {

  @Input()
  public actu: PostActuInterface|null = null;

  constructor(protected app:AppComponent) { }

  ngOnInit() { }

}
