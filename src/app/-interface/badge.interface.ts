import {PictureInterface} from "./picture.interface";

export interface BadgeInterface {

  id: number,
  name: string, 
  CreatedAt: string,
  picture: PictureInterface[]|undefined,
 

}


// {
//   "id": 1,
//   "name": "fvdfsfvdsqd",
//   "CreatedAt": "2024-02-29T12:30:36+00:00",
//   "picture": {
//       "id": 2,
//       "url": "nuerdn",
//       "idUser": 3,
//       "postedAt": "2024-02-23T11:49:39+00:00",
//       "ip": "nrteynt"
//   }
// }