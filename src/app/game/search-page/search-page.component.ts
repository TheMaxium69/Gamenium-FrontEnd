import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit{

  searchValue: string | null = '';

  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    // this.searchValue = this.route.snapshot.paramMap.get('value');// Récupérer la valeur du paramètre "value"

    const valueParam = this.route.snapshot.paramMap.get('value');

    // Récupérer la valeur du paramètre "type"
    const typeParam = this.route.snapshot.paramMap.get('type');

    // Faire quelque chose avec les valeurs récupérées
    console.log('Value:', valueParam);
    console.log('Type:', typeParam);

    // console.log("Search Value", this.searchValue)

  }


}
