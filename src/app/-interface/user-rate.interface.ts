import {GameInterface} from "./game.interface";

export interface UserRateInterface {

  id:number,
  rating:number,
  createdAt: string,
  game: GameInterface[]|undefined,

}

// {
//     "id": 1,
//     "rating": 6,
//     "createdAt": "2024-02-27T09:42:10+00:00",
//     "ip": " nxgch",
//     "user": {
//         "id": 1,
//         "idUseritium": 2,
//         "userRole": {
//             "glossary": {
//                 "title": "example glossary",
//                 "GlossDiv": {
//                     "title": "S",
//                     "GlossList": {
//                         "GlossEntry": {
//                             "ID": "SGML",
//                             "Abbrev": "ISO 8879:1986",
//                             "SortAs": "SGML",
//                             "Acronym": "SGML",
//                             "GlossDef": {
//                                 "para": "A meta-markup language, used to create markup languages such as DocBook.",
//                                 "GlossSeeAlso": [
//                                     "GML",
//                                     "XML"
//                                 ]
//                             },
//                             "GlossSee": "markup",
//                             "GlossTerm": "Standard Generalized Markup Language"
//                         }
//                     }
//                 }
//             }
//         },
//         "joinAt": "2024-02-23T14:14:38+00:00",
//         "lastConnection": "2024-02-23T14:14:38+00:00",
//         "idGame": 2,
//         "ip": {
//             "glossary": {
//                 "title": "example glossary",
//                 "GlossDiv": {
//                     "title": "S",
//                     "GlossList": {
//                         "GlossEntry": {
//                             "ID": "SGML",
//                             "Abbrev": "ISO 8879:1986",
//                             "SortAs": "SGML",
//                             "Acronym": "SGML",
//                             "GlossDef": {
//                                 "para": "A meta-markup language, used to create markup languages such as DocBook.",
//                                 "GlossSeeAlso": [
//                                     "GML",
//                                     "XML"
//                                 ]
//                             },
//                             "GlossSee": "markup",
//                             "GlossTerm": "Standard Generalized Markup Language"
//                         }
//                     }
//                 }
//             }
//         },
//         "email": "hbfvcbdbwf",
//         "displaynameUseritium": "xfbrfdgf",
//         "username": "dfbwvxcb",
//         "displayname": "rhwbcfvbdrf",
//         "token": "fdnbvntfx"
//     },
//     "game": {
//         "id": 2,
//         "idGiantBomb": 0,
//         "guid": "",
//         "name": "",
//         "aliasses": null,
//         "apiDetailUrl": null,
//         "dateAdded": null,
//         "dateLastUpdated": null,
//         "deck": null,
//         "description": null,
//         "expectedReleaseDay": null,
//         "expectedReleaseMonth": null,
//         "expectedReleaseYear": null,
//         "image": null,
//         "imageTags": null,
//         "numberOfUserReviews": null,
//         "originalGameRating": null,
//         "originalReleaseDate": null,
//         "platforms": null,
//         "siteDetailUrl": null
//     }
// },