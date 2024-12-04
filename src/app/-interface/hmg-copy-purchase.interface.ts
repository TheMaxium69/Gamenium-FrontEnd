import {BuyWhereInterface} from "./buy-where.interface";
import {DeviseInterface} from "./devise.interface";

export interface HmgCopyPurchaseInterface {
  id:number,
  price:number,
  year_buy_at:number,
  month_buy_at:number,
  day_buy_at:number,
  buy_where:BuyWhereInterface,
  content:string,
  devise:DeviseInterface,
}
