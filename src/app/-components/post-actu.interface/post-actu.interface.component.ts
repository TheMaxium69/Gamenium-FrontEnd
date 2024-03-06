import { Component, OnInit } from '@angular/core';
import { PostActuService } from '../../-service/post-actu.service';
import { PostActuInterface } from '../../-interface/post-actu.interface';

@Component({
  selector: 'app-post-actu',
  templateUrl: './post-actu.interface.component.html',
  styleUrls: ['./post-actu.interface.component.css'],
})
export class PostActuInterfaceComponent implements OnInit {
  PostActus: PostActuInterface[] = [];

  constructor(private PostActuService: PostActuService) {}

  ngOnInit(): void {
    // this.getPostActus();
  }

  // getPostActus(): void {
  //   this.PostActuService.getAllPostActus().subscribe((PostActus) => {
  //     this.PostActus = PostActus;
  //   });
  // }
}
