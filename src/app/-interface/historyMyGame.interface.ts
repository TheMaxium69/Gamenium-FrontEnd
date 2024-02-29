import { BuyWhereInterface } from "./buywhere.interface";
import { UserRateInterface } from "./user-rate.interface";

export interface HistoryMyGameInterface {

    id:string,
    isFavorite:boolean,
    content:string,
    buyAt:string,
    userrate:UserRateInterface[] | undefined,
    buyware:BuyWhereInterface[] | undefined,

}

// [
//     {
//         "id": 1,
//         "isFavorite": true,
//         "content": "blablabla",
//         "buyAt": "2024-02-29T14:52:33+00:00",
//         "userrate": {
//             "id": 1,
//             "rating": 15,
//             "createdAt": "2024-02-29T14:52:12+00:00",
//             "ip": "255.252.112",
//             "user": {
//                 "id": 1,
//                 "idUseritium": 5735,
//                 "userRole": [
//                     "user"
//                 ],
//                 "joinAt": "2024-02-23T13:15:21+00:00",
//                 "lastConnection": "2024-02-23T13:16:36+00:00",
//                 "idPicture": 1,
//                 "ip": [
//                     "10.0.0.1",
//                     "10.10.10.10"
//                 ],
//                 "email": "lepolak01@gmail.com",
//                 "displaynameUseritium": "MaxUwu",
//                 "username": "Threonaum",
//                 "displayname": "Uwu",
//                 "token": ""
//             },
//             "game": {
//                 "id": 1
//             }
//         },
//         "buywhere": {
//             "id": 1,
//             "isPublic": true,
//             "name": "bob",
//             "createdAt": "2024-02-29T13:40:08+00:00",
//             "ip": "123.456",
//             "user": {
//                 "id": 1,
//                 "idUseritium": 5735,
//                 "userRole": [
//                     "user"
//                 ],
//                 "joinAt": "2024-02-23T13:15:21+00:00",
//                 "lastConnection": "2024-02-23T13:16:36+00:00",
//                 "idPicture": 1,
//                 "ip": [
//                     "10.0.0.1",
//                     "10.10.10.10"
//                 ],
//                 "email": "lepolak01@gmail.com",
//                 "displaynameUseritium": "MaxUwu",
//                 "username": "Threonaum",
//                 "displayname": "Uwu",
//                 "token": ""
//             }
//         }
//     }
// ]