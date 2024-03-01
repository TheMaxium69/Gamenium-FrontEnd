import { Component, OnInit } from '@angular/core';
import { PictureService } from '../../-service/picture.service';
import { PictureInterface } from '../../-interface/picture.interface';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.interface.component.html',
  styleUrls: ['./picture.interface.component.css'],
})
export class PictureInterfaceComponent implements OnInit {
  pictures: PictureInterface[] = [];

  constructor(private PictureService: PictureService) {}

  ngOnInit(): void {
    this.getAllPictures();
  }

  getAllPictures(): void {
    this.PictureService.getAllPictures().subscribe((pictures) => {
      this.pictures = pictures;
    });
  }
}
