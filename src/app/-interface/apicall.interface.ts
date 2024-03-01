import {UserInterface} from "./user.interface";

export interface ApicallInterface {

  message: string,
  result: UserInterface|undefined,
  token: string|undefined,

}
