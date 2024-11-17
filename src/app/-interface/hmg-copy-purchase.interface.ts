import {BuyWhereInterface} from "./buy-where.interface";
import {DeviseInterface} from "./devise.interface";

export interface HmgCopyPurchaseInterface {
  id:number,
  price:number,
  buy_date:Date,
  buy_where:BuyWhereInterface,
  content:string,
  devise:DeviseInterface,
}
