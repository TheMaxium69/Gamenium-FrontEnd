import { GameInterface } from "./game.interface";
import { PictureInterface } from "./picture.interface";

export interface GameProfileInterface {

    id:number,
    joinedAt:string,
    picture:PictureInterface[] | undefined,
    game:GameInterface[] | undefined,

}

// [
//     {
//         "id": 1,
//         "joinedAt": "2024-02-29T14:23:58+00:00",
//         "picture": {
//             "id": 1,
//             "url": "www.tyro.fr",
//             "idUser": 0,
//             "postedAt": "2024-02-29T14:11:08+00:00",
//             "ip": "133.235"
//         },
//         "game": {
//             "id": 1
//         }
//     }
// ]