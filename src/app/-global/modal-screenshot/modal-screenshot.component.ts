import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HmgScreenshotService} from "../../-service/hmg-screenshot.service";
import {HmgScreenshotCategoryInterface} from "../../-interface/hmg-screenshot-category.interface";
import Swal from "sweetalert2";
import {UploadService} from "../../-service/upload.service";
import {HistoryMyGameInterface} from "../../-interface/history-my-game.interface";
import {HmgScreenshotInterface} from "../../-interface/hmg-screenshot.interface";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'modal-screenshot',
  templateUrl: './modal-screenshot.component.html',
  styleUrls: ['./modal-screenshot.component.css']
})
export class ModalScreenshotComponent implements OnInit {

  constructor(protected app:AppComponent,
              private hmgScreenshotService: HmgScreenshotService,
              private uploadService: UploadService) {}


  @Input()
  public myGame:HistoryMyGameInterface|undefined;

  @Output()
  public screenshotAdded: EventEmitter<HmgScreenshotInterface> = new EventEmitter();

  ngOnInit() {
    this.getCategory();
  }

  getCategory(){
    if (this.app.hmgScreenshotCategory.length == 0){
      this.hmgScreenshotService.getAllScreenshotCategory(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseCate:{message:string,result:HmgScreenshotCategoryInterface[]}) => {
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

      // crée une preview de limage quand avant de l'upload
      const previewImage = URL.createObjectURL(this.selectedFile)
      const preview = document.getElementById('preview-image') as HTMLElement
      if (preview) {
        preview.style.backgroundImage = `url(${previewImage})`
      }

    }
  }

  onUpload(form: NgForm) {

    const uploadButton = document.getElementById('upload-button') as HTMLButtonElement
    uploadButton.disabled = true
    uploadButton.textContent = "Envoie du fichier en cours..."

    if (!this.selectedFile) {
      uploadButton.disabled = false
      uploadButton.textContent = "Envoyé"
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur aucune image selectionné',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
      return;
    }

    if (!form.value['category']) {
      uploadButton.disabled = false
      uploadButton.textContent = "Envoyé"
      Swal.fire({
        title: 'Attention!',
        text: 'Veuillez choisir une catégorie',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
      return;
    }

    if (!this.myGame){
      uploadButton.disabled = false
      uploadButton.textContent = "Envoyé"
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur inconnue',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
      })
      return;
    }

    this.uploadService.uploadScreenshot(this.selectedFile, form.value['category'], this.myGame?.id, this.app.setURL(), this.app.createCorsToken(true)).subscribe((responseUploadScreenshot:{message:string,result:HmgScreenshotInterface}) => {

      if (responseUploadScreenshot.message == "good"){

        this.screenshotAdded.emit(responseUploadScreenshot.result);

        if (this.myGame && this.app.myGameAll){

          let myGame = this.myGame;

          const foundMyGameIndex = this.app.myGameAll.findIndex(game => game.id === myGame.id);
          if (foundMyGameIndex !== -1) {
            this.app.myGameAll[foundMyGameIndex] = {
              ...this.app.myGameAll[foundMyGameIndex],
              screenshot: [
                ...(this.app.myGameAll[foundMyGameIndex].screenshot || []),
                responseUploadScreenshot.result
              ]
            };
          }

        }


        this.selectedFile = undefined;
        uploadButton.disabled = false
        uploadButton.textContent = "Envoyé"
        const categorySelect = document.getElementById('category') as HTMLButtonElement
        if (categorySelect){
          categorySelect.value = "";
        }

        Swal.fire({
          title: 'Succès!',
          text: 'Votre screenshot à bien été upload.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })

      } else {

        uploadButton.disabled = false
        uploadButton.textContent = "Envoyé"
        Swal.fire({
          title: 'Échec!',
          text: 'Échec de l\'upload de votre screenshot ',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        })
      }

    }, (error) => {
      uploadButton.disabled = false
      uploadButton.textContent = "Envoyé"
      this.app.erreurSubcribe()
    });
  }



}
