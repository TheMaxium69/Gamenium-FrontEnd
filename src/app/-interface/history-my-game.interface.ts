import {MyGameInterface} from "./my-game.interface";
import {HmgCopyInterface} from "./hmg-copy.interface";
import {HmgSpeedrunInterface} from "./hmg-speedrun.interface";
import {UserRateInterface} from "./user-rate.interface";
import {HmgScreenshotInterface} from "./hmg-screenshot.interface";

export interface HistoryMyGameInterface {

  id:number,
  myGame:MyGameInterface,
  copyGame:HmgCopyInterface[],
  speedrun:HmgSpeedrunInterface[],
  screenshot:HmgScreenshotInterface[],
  rate:UserRateInterface,

  isDelete: boolean;
  tempNote:number|undefined;


}
