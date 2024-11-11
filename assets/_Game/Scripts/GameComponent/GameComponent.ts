import { _decorator, Component, Node } from 'cc';
import { MoveScrewHandle } from '../Controller/MoveScrewHandle';
const { ccclass, property } = _decorator;

@ccclass('GameComponent')
export abstract class GameComponent extends Component 
{
    //protected GameLogic: MoveScrewHandle = MoveScrewHandle.Instance;
}


