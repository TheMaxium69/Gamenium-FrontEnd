import {UserInterface} from "./user.interface";
import {GameInterface} from "./game.interface";

export interface TestInterface {
  id:number,
  user:UserInterface,
  game:GameInterface,
  rating:number,
  content:string,
  test_at:Date
}
