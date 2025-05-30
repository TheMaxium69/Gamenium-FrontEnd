import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

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
import { NavbarActualityComponent } from './actuality/navbar-actuality/navbar-actuality.component';
import { ViewActualityComponent } from "./actuality/view-actuality/view-actuality.component";
import { LoginComponent } from './account/login/login.component';
import { ProfileComponent } from './account/profile/profile.component';
import { SearchGameComponent } from './game/search-game/search-game.component';
import { ProviderComponent } from './actuality/provider/provider.component';
import { GameProfileComponent } from './actuality/game-profile/game-profile.component';
import { ProfilePublicComponent } from './mygame/profile-public/profile-public.component';
import { NoneComponent } from './-global/none/none.component';
import { SearchPageComponent } from './game/search-page/search-page.component';
import { ProfilePrivateComponent } from './mygame/profile-private/profile-private.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HeadProfileComponent } from './mygame/head-profile/head-profile.component';
import { NoAccountProfileComponent } from './mygame/no-account-profile/no-account-profile.component';
import { CommentActualityComponent } from './actuality/comment-actuality/comment-actuality.component';
import { HomeConnectedComponent } from './home/home-connected/home-connected.component';
import { HomeInviteComponent } from './home/home-invite/home-invite.component';
import { PlateformComponent } from './actuality/plateform/plateform.component';
import { ViewMygameComponent } from './-global/view-mygame/view-mygame.component';
import { EditedMygameComponent } from './mygame/edited-mygame/edited-mygame.component';
import { ModalNoteComponent } from './-global/modal-note/modal-note.component';
import { ModalAddGameComponent } from './-global/modal-add-game/modal-add-game.component';
import { PlateformViewComponent } from './mygame/plateform-view/plateform-view.component';
import { TabMygameComponent } from './mygame/tab-mygame/tab-mygame.component';
import { TabPublicComponent } from './mygame/tab-public/tab-public.component';
import { PageThermeComponent } from './-other/page-therme/page-therme.component';
import { CardGameComponent } from './-global/card-game/card-game.component';
import { CardActuComponent } from './-global/card-actu/card-actu.component';
import { CardGameSubComponent } from './-global/card-game-sub/card-game-sub.component';
import { CardProviderComponent } from './-global/card-provider/card-provider.component';
import { CardProfilComponent } from './-global/card-profil/card-profil.component';
import { BackToTopComponent } from './-global/back-to-top/back-to-top.component';
import { ModalProviderComponent } from './-global/modal-provider/modal-provider.component';
import { ModalBuywhereComponent } from './-global/modal-buywhere/modal-buywhere.component';
import { ModalTagComponent } from './-global/modal-tag/modal-tag.component';
import { ModalScreenshotComponent } from './-global/modal-screenshot/modal-screenshot.component';
import { GalleryComponent } from './-global/gallery/gallery.component';
import { WaitingComponent } from './account/waiting/waiting.component';
import { ModalAddPlatformComponent } from './-global/modal-add-platform/modal-add-platform.component';
import { EditedMyplatformComponent } from './mygame/edited-myplatform/edited-myplatform.component';
import { CardPlatformComponent } from './-global/card-platform/card-platform.component';
import { ModalWarnComponent } from './-global/modal-warn/modal-warn.component';
import { ViewMyplatformComponent } from './-global/view-myplatform/view-myplatform.component';

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
    NavbarActualityComponent,
    ViewActualityComponent,
    LoginComponent,
    ProfileComponent,
    SearchGameComponent,
    ProviderComponent,
    GameProfileComponent,
    ProfilePublicComponent,
    NoneComponent,
    SearchPageComponent,
    ProfilePrivateComponent,
    HeadProfileComponent,
    NoAccountProfileComponent,
    CommentActualityComponent,
    HomeConnectedComponent,
    HomeInviteComponent,
    PlateformComponent,
    ViewMygameComponent,
    EditedMygameComponent,
    ModalNoteComponent,
    ModalAddGameComponent,
    PlateformViewComponent,
    TabMygameComponent,
    TabPublicComponent,
    PageThermeComponent,
    CardGameComponent,
    CardActuComponent,
    CardGameSubComponent,
    CardProviderComponent,
    CardProfilComponent,
    BackToTopComponent,
    ModalProviderComponent,
    ModalBuywhereComponent,
    ModalTagComponent,
    ModalScreenshotComponent,
    GalleryComponent,
    WaitingComponent,
    ModalAddPlatformComponent,
    EditedMyplatformComponent,
    CardPlatformComponent,
    ModalWarnComponent,
    ViewMyplatformComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
