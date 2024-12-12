import {UserInterface} from "./user.interface";
import {DeviseInterface} from "./devise.interface";

export interface UserDefaultInterface {
  id: number,
  user:UserInterface
  devise:DeviseInterface
}
