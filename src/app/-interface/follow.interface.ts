import {ProviderInterface} from "./provider.interface";
import {GameProfileInterface} from "./game-profile.interface";
import {UserInterface} from "./user.interface";

export interface FollowInterface {

  id:number,
  provider:ProviderInterface|undefined,
  gameprofil:GameProfileInterface|undefined,
  user:UserInterface

}
