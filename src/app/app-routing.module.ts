import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageHomeComponent} from "./home/page-home/page-home.component";
import {PageGameComponent} from "./game/page-game/page-game.component";
import {PageMygameComponent} from "./mygame/page-mygame/page-mygame.component";
import {PageActualityComponent} from "./actuality/page-actuality/page-actuality.component";
import {PageAccountComponent} from "./account/page-account/page-account.component";
import {ProviderComponent} from "./actuality/provider/provider.component";
import {SearchPageComponent} from "./game/search-page/search-page.component";
import { DetailGameComponent } from './game/detail-game/detail-game.component';
import {PlateformComponent} from "./actuality/plateform/plateform.component";

const routes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'actuality', component: PageActualityComponent},
  {path: 'actuality/:id', component: PageActualityComponent},
  {path: 'game', component: PageGameComponent},
  {path: 'game/:id', component: PageGameComponent},
  {path: 'mygame', component: PageMygameComponent},
  {path: 'mygame/:task', component: PageMygameComponent},
  {path: 'account', component: PageAccountComponent},
  {path: 'profil', component: PageAccountComponent},
  {path: 'provider/:id', component: ProviderComponent},
  {path: 'gameprofile/:id', component: DetailGameComponent},
  {path: 'profil/:id', component: PageMygameComponent},
  {path: 'search/:type/:value', component: SearchPageComponent},
  {path: 'plateform/:id/', component: PlateformComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
