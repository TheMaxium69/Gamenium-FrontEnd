import { BadgeInterface } from "./badge.interface";

export interface BadgeVersUserInterface {

    id:number,
    createdAt:string,
    //user:
    badge:BadgeInterface[] | undefined,

}


// [
//     {
//         "id": 1,
//         "createdAt": "2024-02-29T14:12:27+00:00",
//         "user": {
//             "id": 1,
//             "idUseritium": 5735,
//             "userRole": [
//                 "user"
//             ],
//             "joinAt": "2024-02-23T13:15:21+00:00",
//             "lastConnection": "2024-02-23T13:16:36+00:00",
//             "idPicture": 1,
//             "ip": [
//                 "10.0.0.1",
//                 "10.10.10.10"
//             ],
//             "email": "lepolak01@gmail.com",
//             "displaynameUseritium": "MaxUwu",
//             "username": "Threonaum",
//             "displayname": "Uwu",
//             "token": ""
//         },
//         "badge": {
//             "id": 1,
//             "name": "dev",
//             "createdAt": "2024-02-29T14:12:05+00:00",
//             "picture": {
//                 "id": 1,
//                 "url": "www.tyro.fr",
//                 "idUser": 0,
//                 "postedAt": "2024-02-29T14:11:08+00:00",
//                 "ip": "133.235"
//             }
//         }
//     }
// ]