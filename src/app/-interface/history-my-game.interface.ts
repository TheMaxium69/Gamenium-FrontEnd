import { BuyWhereInterface } from "./buy-where.interface";
import { UserRateInterface } from "./user-rate.interface";
import {UserInterface} from "./user.interface";
import {GameInterface} from "./game.interface";
import {MyGameInterface} from "./my-game.interface";

export interface HistoryMyGameInterface {

  id:string,
  myGame:MyGameInterface,
  copyGame:any,/*Interface a créer*/
  speedrun:any, /*Interface a créer*/
  screenshot:any /*Interface a créer*/


}
