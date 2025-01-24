import { HmpCopyInterface } from "./hmp-copy.interface";
import {PlateformInterface} from "./plateform.interface";
import {myPlatformInterface} from "./my-platform.interface";

export interface HistoryMyPlatformInterface {

  id:number,
  myPlateform:myPlatformInterface,
  copyPlateform:HmpCopyInterface[],



}
