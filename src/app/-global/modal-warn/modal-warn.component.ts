import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";
import {HmgTagsService} from "../../-service/hmg-tags.service";
import {WarnService} from "../../-service/warn.service";

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
}
