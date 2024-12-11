import { Component, OnInit } from '@angular/core';
import { HmgTagsInterface } from 'src/app/-interface/hmg-tags.interface';
import { HmgTagsService } from 'src/app/-service/hmg-tags.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'modal-tag',
  templateUrl: './modal-tag.component.html',
  styleUrls: ['./modal-tag.component.css']
})
export class ModalTagComponent implements OnInit{

  constructor(
    protected app: AppComponent,
    private hmgTagService: HmgTagsService
  ) {}

  ngOnInit(): void {
    this.getTags()
  }

  getTags() {

    if (this.app.tagsUserNoReload.length == 0){

      this.hmgTagService.getTagsAllByUser(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseTags) => {
        if (reponseTags.message == "good") {
          this.app.tagsUserNoReload = reponseTags.result;
        }
      }, (error) => this.app.erreurSubcribe())

    }

  }

  deleteTags(tag : HmgTagsInterface) {
    console.log(tag.id)
    // this.hmgTagService.deleteTag(tag.id, this.app.setURL(), this.app.createCorsToken()).subscribe((response: { message: string; }) => {
    //   if (response.message === "good") {
    //     const index = this.app.tagsUserNoReload.findIndex(item => item.id === tag.id);
    //     if (index !== -1) {
    //       this.app.tagsUserNoReload.splice(index, 1);
    //     }
    //     Swal.fire({
    //       title: 'Succès!',
    //       text: tag.name + ' a bien été supprimé',
    //       icon: 'success',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
    //     })
    //   } else if (response.message === "Tag is use") {
    //     Swal.fire({
    //       title: 'Attention!',
    //       text: 'Vous ne pouvez pas supprimer un Tag que vous utilisez',
    //       icon: 'warning',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
    //     })

    //   } else {
    //     Swal.fire({
    //       title: 'Echec!',
    //       text: 'Echec de la suppression de votre Tag',
    //       icon: 'error',
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
    //     })
    //   }
    // }, (error) => this.app.erreurSubcribe());

  }

}
