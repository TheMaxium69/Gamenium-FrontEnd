import {PostActuInterface} from "./post-actu.interface";
import {UserInterface} from "./user.interface";

export interface CommentInterface {

  id:number,
  created_at: Date,
  lastEdit: string,
  nbEdit: number,
  content: string,
  Post: PostActuInterface,
  user: UserInterface,
}


// {
//     "id": 1,
//     "createdAt": "2024-02-27T09:16:13+00:00",
//     "ip": ",fghf",
//     "lastEdit": "2024-02-27T09:16:13+00:00",
//     "nbEdit": 2,
//     "content": " jghfdgh",
//     "post": {
//         "id": 1,
//         "createdAt": "2024-02-23T14:19:07+00:00",
//         "content": "gdg,gty",
//         "lastEdit": "2024-02-02T15:19:07+00:00",
//         "nbEdit": 2,
//         "provider": {
//             "id": 2,
//             "tagName": ",ifghf,j ",
//             "displayName": "ndftnhfdg",
//             "country": 2,
//             "joindeAt": "2024-02-23T11:50:26+00:00",
//             "createdAt": "2024-02-23T11:50:26+00:00",
//             "parentCompany": 3,
//             "content": "u-erndudtrhn",
//             "banner": 4,
//             "picture": {
//                 "id": 2,
//                 "url": "nuerdn",
//                 "idUser": 3,
//                 "postedAt": "2024-02-23T11:49:39+00:00",
//                 "ip": "nrteynt"
//             }
//         },
//         "gameProfile": {
//             "id": 2,
//             "joinedAt": "2024-02-23T14:00:32+00:00",
//             "picture": {
//                 "id": 2,
//                 "url": "nuerdn",
//                 "idUser": 3,
//                 "postedAt": "2024-02-23T11:49:39+00:00",
//                 "ip": "nrteynt"
//             },
//             "game": {
//                 "id": 2,
//                 "idGiantBomb": 0,
//                 "guid": "",
//                 "name": "",
//                 "aliasses": null,
//                 "apiDetailUrl": null,
//                 "dateAdded": null,
//                 "dateLastUpdated": null,
//                 "deck": null,
//                 "description": null,
//                 "expectedReleaseDay": null,
//                 "expectedReleaseMonth": null,
//                 "expectedReleaseYear": null,
//                 "image": null,
//                 "imageTags": null,
//                 "numberOfUserReviews": null,
//                 "originalGameRating": null,
//                 "originalReleaseDate": null,
//                 "platforms": null,
//                 "siteDetailUrl": null
//             }
//         },
//         "game": {
//             "id": 2,
//             "idGiantBomb": 0,
//             "guid": "",
//             "name": "",
//             "aliasses": null,
//             "apiDetailUrl": null,
//             "dateAdded": null,
//             "dateLastUpdated": null,
//             "deck": null,
//             "description": null,
//             "expectedReleaseDay": null,
//             "expectedReleaseMonth": null,
//             "expectedReleaseYear": null,
//             "image": null,
//             "imageTags": null,
//             "numberOfUserReviews": null,
//             "originalGameRating": null,
//             "originalReleaseDate": null,
//             "platforms": null,
//             "siteDetailUrl": null
//         },
//         "user": {
//             "id": 2,
//             "idUseritium": 2,
//             "userRole": {
//                 "glossary": {
//                     "title": "example glossary",
//                     "GlossDiv": {
//                         "title": "S",
//                         "GlossList": {
//                             "GlossEntry": {
//                                 "ID": "SGML",
//                                 "Abbrev": "ISO 8879:1986",
//                                 "SortAs": "SGML",
//                                 "Acronym": "SGML",
//                                 "GlossDef": {
//                                     "para": "A meta-markup language, used to create markup languages such as DocBook.",
//                                     "GlossSeeAlso": [
//                                         "GML",
//                                         "XML"
//                                     ]
//                                 },
//                                 "GlossSee": "markup",
//                                 "GlossTerm": "Standard Generalized Markup Language"
//                             }
//                         }
//                     }
//                 }
//             },
//             "joinAt": "2024-02-23T14:14:38+00:00",
//             "lastConnection": "2024-02-23T14:14:38+00:00",
//             "idPicture": 2,
//             "ip": {
//                 "glossary": {
//                     "title": "example glossary",
//                     "GlossDiv": {
//                         "title": "S",
//                         "GlossList": {
//                             "GlossEntry": {
//                                 "ID": "SGML",
//                                 "Abbrev": "ISO 8879:1986",
//                                 "SortAs": "SGML",
//                                 "Acronym": "SGML",
//                                 "GlossDef": {
//                                     "para": "A meta-markup language, used to create markup languages such as DocBook.",
//                                     "GlossSeeAlso": [
//                                         "GML",
//                                         "XML"
//                                     ]
//                                 },
//                                 "GlossSee": "markup",
//                                 "GlossTerm": "Standard Generalized Markup Language"
//                             }
//                         }
//                     }
//                 }
//             },
//             "email": "hgdfhfg",
//             "displaynameUseritium": "hdsfghfd",
//             "username": "hdsfghfd",
//             "displayname": "hsedfgfv",
//             "token": "hdfwxgx"
//         }
//     },
//     "user": {
//         "id": 2,
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
//         "idPicture": 2,
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
//         "email": "hgdfhfg",
//         "displaynameUseritium": "hdsfghfd",
//         "username": "hdsfghfd",
//         "displayname": "hsedfgfv",
//         "token": "hdfwxgx"
//     }
// },
