import {NetworkInterface} from "./network.interface";

export interface MyAccountExterneInterface {

  id:number,
  createdAt: string,    
  apiKey: string,
  Network: NetworkInterface[]|undefined,
//   user_id: UserInterface[]|undefined,


}


// {
//     "id": 1,
//     "createdAt": "2024-02-27T10:21:10+00:00",
//     "apiKey": ",itfy,yt",
//     "network": {
//         "id": 2,
//         "name": "nsetsny",
//         "urlApi": "nyrsdrnry"
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
