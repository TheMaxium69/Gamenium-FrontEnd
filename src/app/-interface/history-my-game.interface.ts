import {MyGameInterface} from "./my-game.interface";
import {HmgCopyInterface} from "./hmg-copy.interface";
import {HmgSpeedrunInterface} from "./hmg-speedrun.interface";
import {UserRateInterface} from "./user-rate.interface";

export interface HistoryMyGameInterface {

  id:number,
  myGame:MyGameInterface,
  copyGame:HmgCopyInterface[],
  speedrun:HmgSpeedrunInterface[],
  screenshot:any /*Interface a créer*/
  rate:UserRateInterface,

  isDelete: boolean;
  tempNote:number|undefined;


}
