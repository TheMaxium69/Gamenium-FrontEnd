import { HmpCopyInterface } from "./hmp-copy.interface";

export interface HistoryMyPlatformInterface {

  id:number,
  myPlateform:{
    id:number|undefined,
    plateform:{
      id:number,
      id_giant_bomb:number,
      name:string
    },
    added_at:Date
  },
  copyPlateform:HmpCopyInterface[],
 


}
