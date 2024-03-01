//import { UsereInterface } from "./user.interface";
import { PostActuInterface} from "./post-actu.interface";
import { CommentInterface} from "./comment.interface";

export interface LikeInterface {

    id:number,
    createdAt:string,
    //user:
    post:PostActuInterface[] | undefined,
    comment:CommentInterface[] | undefined,
    
}



// [
//     {
//         "id": 1,
//         "ip": "458.256.32",
//         "createdAt": "2024-02-29T14:43:28+00:00",
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
//         "post": {
//             "id": 1,
//             "createdAt": "2024-02-29T14:41:57+00:00",
//             "content": "blabla",
//             "lastEdit": "2024-02-01T15:41:57+00:00",
//             "nbEdit": 2,
//             "provider": {
//                 "id": 1,
//                 "tagName": "revendeur",
//                 "displayName": "instant gaming",
//                 "country": 2,
//                 "joindeAt": "2024-02-29T14:39:57+00:00",
//                 "createdAt": "2024-02-29T14:39:57+00:00",
//                 "picture": 1,
//                 "parentCompany": 2,
//                 "content": "ceci est un exemple",
//                 "banner": 0
//             },
//             "gameProfile": {
//                 "id": 1,
//                 "joinedAt": "2024-02-29T14:23:58+00:00",
//                 "picture": {
//                     "id": 1,
//                     "url": "www.tyro.fr",
//                     "idUser": 0,
//                     "postedAt": "2024-02-29T14:11:08+00:00",
//                     "ip": "133.235"
//                 },
//                 "game": {
//                     "id": 1
//                 }
//             },
//             "game": {
//                 "id": 1
//             },
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
//         },
//         "comment": {
//             "id": 1,
//             "createdAt": "2024-02-29T14:42:56+00:00",
//             "ip": "482.43.576",
//             "lastEdit": "2024-02-29T14:42:56+00:00",
//             "nbEdit": 2,
//             "content": "blabloubli",
//             "post": {
//                 "id": 1,
//                 "createdAt": "2024-02-29T14:41:57+00:00",
//                 "content": "blabla",
//                 "lastEdit": "2024-02-01T15:41:57+00:00",
//                 "nbEdit": 2,
//                 "provider": {
//                     "id": 1,
//                     "tagName": "revendeur",
//                     "displayName": "instant gaming",
//                     "country": 2,
//                     "joindeAt": "2024-02-29T14:39:57+00:00",
//                     "createdAt": "2024-02-29T14:39:57+00:00",
//                     "picture": 1,
//                     "parentCompany": 2,
//                     "content": "ceci est un exemple",
//                     "banner": 0
//                 },
//                 "gameProfile": {
//                     "id": 1,
//                     "joinedAt": "2024-02-29T14:23:58+00:00",
//                     "picture": {
//                         "id": 1,
//                         "url": "www.tyro.fr",
//                         "idUser": 0,
//                         "postedAt": "2024-02-29T14:11:08+00:00",
//                         "ip": "133.235"
//                     },
//                     "game": {
//                         "id": 1
//                     }
//                 },
//                 "game": {
//                     "id": 1
//                 },
//                 "user": {
//                     "id": 1,
//                     "idUseritium": 5735,
//                     "userRole": [
//                         "user"
//                     ],
//                     "joinAt": "2024-02-23T13:15:21+00:00",
//                     "lastConnection": "2024-02-23T13:16:36+00:00",
//                     "idPicture": 1,
//                     "ip": [
//                         "10.0.0.1",
//                         "10.10.10.10"
//                     ],
//                     "email": "lepolak01@gmail.com",
//                     "displaynameUseritium": "MaxUwu",
//                     "username": "Threonaum",
//                     "displayname": "Uwu",
//                     "token": ""
//                 }
//             },
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