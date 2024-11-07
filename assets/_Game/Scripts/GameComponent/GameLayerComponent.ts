import { _decorator, Component, Node } from 'cc';
import { GameLayer } from './GameLayer';
import { GameComponent } from './GameComponent';
const { ccclass, property } = _decorator;

@ccclass( 'GameLayerComponent' )
export class GameLayerComponent extends GameComponent
{
    private gameLayer: GameLayer | null = null;

    public get gameLayerContainer (): GameLayer | null
    {
        if ( this.gameLayer === null ) 
        {
            const parent = this.node.parent;

            this.gameLayer = parent?.getComponent( GameLayer ) || null;
        }
        return this.gameLayer;
    }

    public get Layer (): number
    {
        if ( this.gameLayerContainer === null ) console.error( "GameLayer is null" );
        return this.gameLayerContainer?.getLayer() || 0;
    }
}


