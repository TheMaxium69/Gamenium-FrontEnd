import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../-service/comment.service';
import { CommentInterface } from '../../-interface/comment.interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.interface.component.html',
  styleUrls: ['./comment.interface.component.css'],
})
export class CommentInterfaceComponent implements OnInit {
  comments: CommentInterface[] = [];

  constructor(private CommentService: CommentService) {}

  ngOnInit(): void {
    this.getAllComments();
  }

  getAllComments(): void {
    this.CommentService.getAllComments().subscribe((comments) => {
      this.comments = comments;
    });
  }
}
