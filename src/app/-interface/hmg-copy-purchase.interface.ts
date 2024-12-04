import {BuyWhereInterface} from "./buy-where.interface";
import {DeviseInterface} from "./devise.interface";

export interface HmgCopyPurchaseInterface {
  id:number,
  price:number,
  year_buy_date:number,
  month_buy_date:number,
  day_buy_date:number,
  buy_where:BuyWhereInterface,
  content:string,
  devise:DeviseInterface,
}
