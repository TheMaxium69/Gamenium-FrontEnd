import {UserInterface} from "./user.interface";
import {BadgeInterface} from "./badge.interface";

export interface ApicallInterface {

  message: string,
  result: UserInterface|any|undefined,
  token: string|undefined,

}
