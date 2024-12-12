import {PictureInterface} from "./picture.interface";
import {HistoryMyGameInterface} from "./history-my-game.interface";
import {HmgScreenshotCategoryInterface} from "./hmg-screenshot-category.interface";
import {HmgCopyInterface} from "./hmg-copy.interface";

export interface HmgScreenshotInterface {
  id:number,
  picture:PictureInterface,
  myGame:HistoryMyGameInterface,
  category:HmgScreenshotCategoryInterface,
  copy:HmgCopyInterface|null
}
