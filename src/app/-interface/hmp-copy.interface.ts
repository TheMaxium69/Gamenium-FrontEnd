import {HmgCopyEtatInterface} from "./hmg-copy-etat.interface";
import {HmgCopyPurchaseInterface} from "./hmg-copy-purchase.interface";
import {HmgCopyRegionInterface} from "./hmg-copy-region.interface";

export interface HmpCopyInterface {
  id:number,
  edition:string|undefined|null,
  barcode:string|undefined|null,
  content:string|undefined|null,
  isBox:boolean,
  etat:HmgCopyEtatInterface,
  purchase:HmgCopyPurchaseInterface,
  region:HmgCopyRegionInterface
}
