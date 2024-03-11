import {PictureInterface} from "./picture.interface";

export interface ProviderInterface {

  id:number,
  tagName:string,
  displayName:string,
  country:number,
  joindeAt: string|undefined,
  parentCompagny:number,
  content: string,
  banner:number,
  picture: PictureInterface|undefined,
  color:string,

}

// {
//     "id": 1,
//     "tagName": "juetrynu",
//     "displayName": "nrytnyrdt",
//     "country": 2,
//     "joindeAt": "2024-02-23T11:50:26+00:00",
//     "createdAt": "2024-02-23T11:50:26+00:00",
//     "parentCompany": 2,
//     "content": "n urtenyffdt",
//     "banner": 2,
//     "picture": {
//         "id": 1,
//         "url": "htrednyjrt",
//         "idUser": 1,
//         "postedAt": "2024-02-23T11:49:39+00:00",
//         "ip": "ytu;i;,ryt"
//     }
// },
