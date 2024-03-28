import { Component, OnInit } from '@angular/core';
import { LikeService } from '../../-service/like.service';
import { LikeInterface } from '../../-interface/like.interface';

@Component({
  selector: 'app-like',
  templateUrl: './like.interface.component.html',
  styleUrls: ['./like.interface.component.css'],
})
export class LikeInterfaceComponent {
  Likes: LikeInterface[] = [];

  constructor(private LikeService: LikeService) {}

  // ngOnInit(): void {
  //   this.getAllLikes();
  // }

  // getAllLikes(): void {
  //   this.LikeService.getAllLikes().subscribe((Likes) => {
  //     this.Likes = Likes;
  //   });
  // }
}
