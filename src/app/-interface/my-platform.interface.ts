import {PlateformInterface} from "./plateform.interface";
import {UserInterface} from "./user.interface";

export interface myPlatformInterface {

  id:number|undefined,
  plateform:PlateformInterface,
  user:UserInterface,
  added_at:Date

}
