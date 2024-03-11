import {PictureInterface} from "./picture.interface";

export interface UserInterface {
  id:number,
  username:string,
  email:string,
  displayname:string,
  displaynameUseritium:string,
  joinAt:Date,
  userRole:string[]
  pp_id: PictureInterface[]|undefined,
  themeColor: string|[];
}
