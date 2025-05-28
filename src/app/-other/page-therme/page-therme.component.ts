import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-page-therme',
  templateUrl: './page-therme.component.html',
  styleUrls: ['./page-therme.component.css']
})
export class PageThermeComponent implements OnInit {

  year:string = "";

  ngOnInit() {
    this.year = new Date().getFullYear().toString();
  }

}
