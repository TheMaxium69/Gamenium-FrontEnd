import {UserInterface} from "./user.interface";
import {CommentInterface} from "./comment.interface";

export interface CommentReplyInterface {

  id:number,
  created_at: Date,
  lastEdit: string,
  nbEdit: number,
  content: string,
  comment: CommentInterface,
  user: UserInterface,
}
