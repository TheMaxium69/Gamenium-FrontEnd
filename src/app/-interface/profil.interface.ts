import {PictureInterface} from "./picture.interface";

export interface ProfilInterface {

  id:string,
  username:string,
  displayname:string|undefined,
  displaynameUseritium:string,
  joinAt:Date,
  themeColor:string|undefined,
  picture:PictureInterface|undefined,
  nbGame:number,
  nbNote:number,
  reseau:[]

}
