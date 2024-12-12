import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HmgScreenshotService} from "../../-service/hmg-screenshot.service";
import {HmgScreenshotCategoryInterface} from "../../-interface/hmg-screenshot-category.interface";
import Swal from "sweetalert2";
import {UploadProfilePictureService} from "../../-service/upload.service";

@Component({
  selector: 'modal-screenshot',
  templateUrl: './modal-screenshot.component.html',
  styleUrls: ['./modal-screenshot.component.css']
})
export class ModalScreenshotComponent implements OnInit {

  constructor(protected app:AppComponent,
              private hmgScreenshotService: HmgScreenshotService,
              private uploadService: UploadProfilePictureService) {}

  ngOnInit() {
    this.getCategory();
  }

  getCategory(){
    if (this.app.hmgScreenshotCategory.length == 0){
      this.hmgScreenshotService.getAllScreenshotCategory(this.app.setURL()).subscribe((reponseCate:{message:string,result:HmgScreenshotCategoryInterface[]}) => {
        if (reponseCate.message == "good"){
          this.app.hmgScreenshotCategory = reponseCate.result
        }
      })
    }
  }


  selectedFile:File|undefined

  onFileChanged(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0]

      // // crée une preview de limage quand avant de l'upload
      // const previewImage = URL.createObjectURL(this.selectedFile)
      //
      // const preview = document.querySelector('.profile-avatar') as HTMLElement
      // if (preview) {
      //   preview.style.backgroundImage = `url(${previewImage})`
      //   preview.style.backgroundSize = 'cover'
      //   preview.style.backgroundPosition = 'center'
      // }
      //
      console.log(this.selectedFile);
      // console.log(previewImage)
    }
  }

  onUpload() {

    if (!this.selectedFile) {
      console.log('Aucun fichier sélectionné');
      return;
    }

    // const uploadButton = document.querySelector('#upload-button') as HTMLButtonElement
    // uploadButton.disabled = true
    // uploadButton.textContent = "Envoie du fichier en cours..."

    this.uploadService.uploadScreenshot(this.selectedFile, 1, 2, this.app.setURL(), this.app.createCorsToken(true)).subscribe(responseUploadScreenshot => {

      if (responseUploadScreenshot.message == "good"){

        Swal.fire({
          title: 'Succès!',
          text: 'Votre screenshot à bien été upload.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      } else {

        Swal.fire({
          title: 'Erreur!',
          text: 'Échec de l\'upload de votre screenshot ',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }

    }, (error) => this.app.erreurSubcribe());
  }



}
