import {GameImageInterface} from "./game-image.interface";

export interface GameInterface {

  id:number,
  idGiantBomb:number,
  guid: string,
  name: string,
  aliases: string,
  apiDetailUrl: string,
  dateAdded: string,
  dateLastUpdated: string,
  deck: string,
  description: string,
  nbEdit:number,
  expectedReleaseDay:number,
  expectedReleaseMonth:string,
  expectedReleaseYear:number,
  image:GameImageInterface,
  imageTags:JSON,
  numberOfUserReviews:number,
  originalGameRating: string,
  platforms:JSON,
  siteDetailUrl: string,
  searchValue?: string;

}

// {
//     "id": 1,
//     "idGiantBomb": 0,
//     "guid": "",
//     "name": "",
//     "aliasses": null,
//     "apiDetailUrl": null,
//     "dateAdded": null,
//     "dateLastUpdated": null,
//     "deck": null,
//     "description": null,
//     "expectedReleaseDay": null,
//     "expectedReleaseMonth": null,
//     "expectedReleaseYear": null,
//     "image": null,
//     "imageTags": null,
//     "numberOfUserReviews": null,
//     "originalGameRating": null,
//     "originalReleaseDate": null,
//     "platforms": null,
//     "siteDetailUrl": null
// },
