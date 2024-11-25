import { Component, OnInit } from '@angular/core';
import { PostActuInterface } from 'src/app/-interface/post-actu.interface';
import { PostActuService } from 'src/app/-service/post-actu.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home-invite',
  templateUrl: './home-invite.component.html',
  styleUrls: ['./home-invite.component.css']
})
export class HomeInviteComponent implements OnInit {
  postActuFollowOrAll: PostActuInterface[] = [];

  constructor(
    private app: AppComponent,
    private postActuService: PostActuService
  ) {}

  ngOnInit(): void {
    this.getActuAll();
  }

  getActuAll() {
    console.log('Fetching all actualities');
    this.postActuService.getActuAll(this.app.setURL()).subscribe(responseActu => {
      if (responseActu.message === 'good') {
        this.postActuFollowOrAll = responseActu.result;
      } else {
        console.log("failed fetching")
      }
    });
  }

}

