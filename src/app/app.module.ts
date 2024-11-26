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
import { CardActualityComponent } from "./actuality/card-actuality/card-actuality.component";
import { LoginComponent } from './account/login/login.component';
import { BadgeInterfaceComponent } from './-components/badge.interface/badge.interface.component';
import {PostActuInterfaceComponent} from "./-components/post-actu.interface/post-actu.interface.component";
import {ProviderInterfaceComponent} from "./-components/provider.interface/provider.interface.component";
import {CommentInterfaceComponent} from "./-components/comment.interface/comment.interface.component";
import {UserRateInterfaceComponent} from "./-components/user-rate.interface/user-rate.interface.component";
import {SocialNetworkInterfaceComponent} from "./-components/social-network.interface/social-network.interface.component";
import {HistoryMyGameInterfaceComponent} from "./-components/history-my-game.interface/history-my-game.interface.component";
import {GameProfileInterfaceComponent} from "./-components/game-profile.interface/game-profile.interface.component";
import {PictureInterfaceComponent} from "./-components/picture.interface/picture.interface.component";
import {BadgeVersUserInterfaceComponent} from "./-components/badge-vers-user.interface/badge-vers-user.interface.component";
import {GameInterfaceComponent} from "./-components/game.interface/game.interface.component";
import { MyAccountExterneInterfaceComponent } from './-components/my-account-externe.interface/my-account-externe.interface.component';
import { PlatformInterfaceComponent } from './-components/platform.interface/platform.interface.component';
import { LikeInterfaceComponent } from './-components/like.interface/like.interface.component';
import { ProfileComponent } from './account/profile/profile.component';
import { PreviewGameComponent } from './game/preview-game/preview-game.component';
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
import { ModalNoteUnselectComponent } from './-global/modal-note-unselect/modal-note-unselect.component';
import { ModalAddGameUnselectComponent } from './-global/modal-add-game-unselect/modal-add-game-unselect.component';
import { PlateformViewComponent } from './mygame/plateform-view/plateform-view.component';
import { TabMygameComponent } from './mygame/tab-mygame/tab-mygame.component';
import { TabPublicComponent } from './mygame/tab-public/tab-public.component';

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
    CardActualityComponent,
    LoginComponent,
    BadgeInterfaceComponent,
    PostActuInterfaceComponent,
    ProviderInterfaceComponent,
    GameInterfaceComponent,
    BadgeVersUserInterfaceComponent,
    PictureInterfaceComponent,
    GameProfileInterfaceComponent,
    HistoryMyGameInterfaceComponent,
    SocialNetworkInterfaceComponent,
    UserRateInterfaceComponent,
    CommentInterfaceComponent,
    MyAccountExterneInterfaceComponent,
    PlatformInterfaceComponent,
    LikeInterfaceComponent,
    ProfileComponent,
    PreviewGameComponent,
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
    ModalNoteUnselectComponent,
    ModalAddGameUnselectComponent,
    PlateformViewComponent,
    TabMygameComponent,
    TabPublicComponent

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
