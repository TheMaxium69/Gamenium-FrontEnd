import {PictureInterface} from "./picture.interface";
import {ProfilSocialNetworkInterface} from "./profil-social-network.interface";

export interface ProfilInterface {

  id:number,
  username:string,
  displayname:string|undefined,
  displaynameUseritium:string,
  joinAt:Date,
  themeColor:string|undefined,
  picture:string|undefined,
  nbGame:number,
  nbNote:number,
  reseau:ProfilSocialNetworkInterface[];

}
