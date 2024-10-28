import { _decorator, Component, Node } from 'cc';
import { MoveScrewHandle } from '../Controller/MoveScrewHandle';
const { ccclass, property } = _decorator;

@ccclass('GameComponent')
export abstract class GameComponent extends Component {
    private _gamelogic : MoveScrewHandle = null;

    public get GameLogic (): MoveScrewHandle
    {
        if ( this._gamelogic === null ) 
        {
            this._gamelogic = MoveScrewHandle.gInstance;
        }

        return this._gamelogic;
    }
}


