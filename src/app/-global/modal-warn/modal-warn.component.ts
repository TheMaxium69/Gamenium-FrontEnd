import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HmgTagsService} from "../../-service/hmg-tags.service";
import {WarnService} from "../../-service/warn.service";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'modal-warn',
  templateUrl: './modal-warn.component.html',
  styleUrls: ['./modal-warn.component.css']
})
export class ModalWarnComponent implements OnInit{

  constructor(
    protected app: AppComponent,
    private warnService: WarnService,
  ) {}

  ngOnInit(): void {
    this.getWarnType()
  }

  getWarnType() {

    if (this.app.warnTypeNoReload.length == 0){
      this.warnService.getWarnType(this.app.setURL(), this.app.createCorsToken()).subscribe((reponseWarn) => {
        if (reponseWarn.message == "good") {
          this.app.warnTypeNoReload = reponseWarn.result;
        }
      }, (error) => this.app.erreurSubcribe())
    }

  }

  addWarn(warnForm: NgForm) {

    let body: WarnAddInterface = {
      "warn_type_id": warnForm.value.warn_reason,
      "profil_id": null,
      "comment_id": null,
      "actu_id": null,
      "comment_reply_id": null,
      "hmg_id": null,
      "hmp_id": null,
      "content": warnForm.value.warn_description,
    }

    if (this.app.warnTemp?.id) {
      if (this.app.warnTemp?.type == "profil") {
        body.profil_id = this.app.warnTemp.id;
      }

      if (this.app.warnTemp?.type == "comment") {
        body.comment_id = this.app.warnTemp.id;
      }

      if (this.app.warnTemp?.type == "actu") {
        body.actu_id = this.app.warnTemp.id;
      }

      if (this.app.warnTemp?.type == "comment_reply") {
        body.comment_reply_id = this.app.warnTemp.id;
      }

      if (this.app.warnTemp?.type == "hmg") {
        body.hmg_id = this.app.warnTemp.id;
      }

      if (this.app.warnTemp?.type == "hmp") {
        body.hmp_id = this.app.warnTemp.id;
      }

    }

    // return console.log(body);

    this.warnService.addWarn(JSON.stringify(body), this.app.setURL(), this.app.createCorsToken()).subscribe((reponseWarn) => {


      warnForm.resetForm();
      this.app.warnTemp = undefined;

      if (reponseWarn.message == "good") {

        Swal.fire({
          title: 'Merci!',
          text: 'Merci d\'avoir signalé ce comportement.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        });

      } else if (reponseWarn.message == "spam"){

        Swal.fire({
          title: 'Attention!',
          text: 'Vous avez déjà signalé ce comportement.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        });

      } else {

        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: this.app.userConnected?.themeColor || this.app.colorDefault
        });

      }
    }, (error) => this.app.erreurSubcribe())


  }
}


export interface WarnAddInterface {

  warn_type_id: number,
  profil_id: number | null,
  comment_id: number | null,
  actu_id: number | null,
  comment_reply_id: number | null,
  hmg_id: number | null,
  hmp_id: number | null,
  content: string | null,
}
