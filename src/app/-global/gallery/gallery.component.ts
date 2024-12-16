import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit{

  @Input()
  public imgUrl: string | null = null;

  constructor(protected app:AppComponent) {}

  ngOnInit(): void {


  }

}
