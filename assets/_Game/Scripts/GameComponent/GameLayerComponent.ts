import { _decorator, Component, Node } from 'cc';
import { GameLayer } from './GameLayer';
const { ccclass, property } = _decorator;

@ccclass( 'GameLayerComponent' )
export class GameLayerComponent extends Component
{
    private _gameLayer: GameLayer | null = null;

    public get gameLayerContainer (): GameLayer | null
    {
        if ( this._gameLayer === null ) 
        {
            const parent = this.node.parent;

            this._gameLayer = parent?.getComponent( GameLayer ) || null;
        }
        return this._gameLayer;
    }

    public get Layer (): number
    {
        return this.gameLayerContainer?.getLayer() || 0;
    }
}


