import {MyGameInterface} from "./my-game.interface";
import {HmgCopyInterface} from "./hmg-copy.interface";
import {HmgSpeedrunInterface} from "./hmg-speedrun.interface";

export interface HistoryMyGameInterface {

  id:string,
  myGame:MyGameInterface,
  copyGame:HmgCopyInterface[],
  speedrun:HmgSpeedrunInterface[],
  screenshot:any /*Interface a créer*/


}
