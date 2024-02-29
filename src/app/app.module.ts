import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageHomeComponent } from './home/page-home/page-home.component';
import { PageActualityComponent } from './actuality/page-actuality/page-actuality.component';
import { DetailActualityComponent } from './actuality/detail-actuality/detail-actuality.component';
import { PageMygameComponent } from './mygame/page-mygame/page-mygame.component';
import { PageAccountComponent } from './account/page-account/page-account.component';
import { PageGameComponent } from './game/page-game/page-game.component';
import { DetailGameComponent } from './game/detail-game/detail-game.component';
import { NavbarComponent } from "./-global/navbar/navbar.component";

@NgModule({
  declarations: [
    AppComponent,
    PageHomeComponent,
    PageActualityComponent,
    DetailActualityComponent,
    PageMygameComponent,
    PageAccountComponent,
    PageGameComponent,
    DetailGameComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
