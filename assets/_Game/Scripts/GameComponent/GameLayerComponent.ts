import { _decorator, Component, Node } from 'cc';
import { GameLayerOder } from './GameLayerOder';
const { ccclass, property } = _decorator;

@ccclass( 'GameLayerComponent' )
export class GameLayerComponent extends Component
{
    private gameLayerOder: GameLayerOder | null = null;

    public get gameLayerContainer (): GameLayerOder | null
    {
        if ( this.gameLayerOder === null ) 
        {
            const parent = this.node.parent;

            this.gameLayerOder = parent?.getComponent( GameLayerOder ) || null;
        }
        return this.gameLayerOder;
    }

    public get Layer (): number
    {
        if ( this.gameLayerContainer === null ) console.error( "GameLayer is null" );
        return this.gameLayerContainer?.getLayer() || 0;
    }
}


