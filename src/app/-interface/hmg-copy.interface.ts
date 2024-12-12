import {HmgCopyFormatInterface} from "./hmg-copy-format.interface";
import {HmgCopyEtatInterface} from "./hmg-copy-etat.interface";
import {HmgCopyPurchaseInterface} from "./hmg-copy-purchase.interface";
import {HmgCopyRegionInterface} from "./hmg-copy-region.interface";
import {HmgCopyLanguageInterface} from "./hmg-copy-language.interface";

export interface HmgCopyInterface {
  id:number,
  edition:string|undefined|null,
  barcode:string|undefined|null,
  content:string|undefined|null,
  etat:HmgCopyEtatInterface,
  format:HmgCopyFormatInterface,
  purchase:HmgCopyPurchaseInterface,
  region:HmgCopyRegionInterface,
  language:HmgCopyLanguageInterface[]
}
