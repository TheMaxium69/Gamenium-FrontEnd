import {GiantbombDetailInterface} from "./giantbomb-detail.interface";

export interface GiantbombInterface {
  name:string,
  release_date:string,
  average_score:string,
  detail: GiantbombDetailInterface
}