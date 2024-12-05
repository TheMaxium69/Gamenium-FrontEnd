import { Component, Input, OnInit } from '@angular/core';
import { ProviderInterface } from 'src/app/-interface/provider.interface';
import { PostActuInterface } from 'src/app/-interface/post-actu.interface';
import { FollowService } from 'src/app/-service/follow.service';
import { AppComponent } from 'src/app/app.component';
import Swal from "sweetalert2";


@Component({
  selector: 'app-modal-provider',
  templateUrl: './modal-provider.component.html',
  styleUrls: ['./modal-provider.component.css']
})
export class ModalProviderComponent implements OnInit {


  constructor(
    private followService: FollowService,
    protected app: AppComponent
  ) {
  }

  @Input()
  providerFollowed: ProviderInterface[] = []

  @Input()
  providerFollowActuAll: PostActuInterface[] = []

  ngOnInit(): void {
  }

  getNbOfActu(providerId: number) {
    return this.providerFollowActuAll.filter(actu => actu.Provider?.id === providerId).length
  }

  lastPostDate(providerId: number) {
    const latest = this.providerFollowActuAll
    .filter(actu => actu.Provider?.id === providerId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    return latest ? latest.created_at : ''
  }

  unfollowProvider(providerId: number) {
    this.followService.deleteFollowProvider(providerId, this.app.setURL(), this.app.createCorsToken()).subscribe(response => {
      if (response.message == 'follow deleted successfully') {
        this.providerFollowed = this.providerFollowed.filter(provider => provider.id !== providerId);
      } else {
        Swal.fire({
          title: 'Echec!',
          text: 'Echec du désabonnement',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected.themeColor || this.app.colorDefault
        })
      }
    }, (error) => this.app.erreurSubcribe())
  }


}
