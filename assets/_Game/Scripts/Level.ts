import { _decorator, Component, Node } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
import { Screw } from './GameComponent/Screw/Screw';
import { PolygonCollider2D } from 'cc';
import { GameLayerOder } from './GameComponent/GameLayerOder';
import { ScrewRenderer } from './GameComponent/Screw/ScrewRenderer';
import { JsonAsset } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

export class ScrewData
{
    layer: number;
    position: {
        x: string;
        y: string;
    };
    screwId: number;
    shapeId: number;
    colorId: number;
    barNames: string[];
}

@ccclass( 'Level' )
export class Level extends Component
{
    //#region PRIVATE FIELDS
    private _updatedGamePlayer = false;
    private updatedHideLayer = false;
    private flex = false;
    private syncDataBox = false;
    @property( JsonAsset )
    jsonData: JsonAsset = null;
    @property( [ String ] )
    listBarName: string[] = [];
    private barLayer: 10;
    private screwLayer: 11;
    @property( [ BarController ] )
    listBar: BarController[] = [];
    @property( [ SpriteFrame ] )
    listSpriteFrame: SpriteFrame[] = [];

    //#endregion

    //#region PROPERTIES
    @property
    set UpdatedGamePlayer ( value: boolean )
    {
        if ( !this._updatedGamePlayer )
        {
            this._updatedGamePlayer = value;
            this.updateGameLayer();
            this.updateLayerBarAndScrew();
            this.setPolygonCollider();
            this.setScrewToBar();
        }
    }

    get UpdatedGamePlayer ()
    {
        return this._updatedGamePlayer;
    }

    @property
    set Flex ( value: boolean )
    {
        if ( !this.flex )
        {
            this.flex = value;
            this.setFlex();
        }
    }

    get Flex ()
    {
        return this.flex;
    }

    @property
    set SyncDataBox ( value: boolean )
    {
        if ( !this.syncDataBox )
        {
            this.syncDataBox = value;

        }
    }
    get SyncDataBox ()
    {
        return this.syncDataBox;
    }


    //#endregion

    updateGameLayer ()
    {
        var gamelayers = this.node.getComponentsInChildren( GameLayerOder );
        for ( let i = 0; i < gamelayers.length; i++ )
        {
            gamelayers[ i ].layerOrder = i;
        }
    }

    updateLayerBarAndScrew ()
    {
        var bars = this.node.getComponentsInChildren( BarController );
        var screws = this.node.getComponentsInChildren( Screw );

        bars.forEach( element =>
        {
            element.node.layer = 1 << 10;
            var child = element.node.children;
            child.forEach( element =>
            {
                element.layer = 1 << 10;
            } );
        } );
        screws.forEach( element =>
        {
            element.node.layer = 1 << 11;
            var child = element.node.children;
            child.forEach( element =>
            {
                element.layer = 1 << 11;
            } );
        } );
    }

    setPolygonCollider ()
    {
        var bars = this.node.getComponentsInChildren( BarController );
        bars.forEach( element =>
        {
            var modelCollider = element.node.children[ 0 ].getComponent( PolygonCollider2D );
            if ( modelCollider === null ) return;
            element.getComponent( PolygonCollider2D ).threshold = 10;
            element.getComponent( PolygonCollider2D ).points = [];
            element.getComponent( PolygonCollider2D ).points = modelCollider.points;
            element.getComponent( PolygonCollider2D ).apply();
            modelCollider.destroy();
        } );
    }

    setScrewToBar ()
    {
        var screws = this.node.getComponentsInChildren( Screw );
        var bars = this.node.getComponentsInChildren( BarController );
        var listDataScrews: ScrewData[] = [];
        const levelData = this.jsonData.json;

        levelData.screws.forEach( screw =>
        {
            const screwData: ScrewData = {
                layer: screw.layer,
                position: {
                    x: screw.position.x,
                    y: screw.position.y
                },
                screwId: screw.screwId,
                shapeId: screw.shapeId,
                colorId: screw.colorId,
                barNames: screw.barNames
            };
            listDataScrews.push( screwData );
        } );

        //console.log( listDataScrews );
        for ( let i = 0; i < screws.length; i++ )
        {
            listDataScrews[ i ].barNames.forEach( barName =>
            {
                for ( let j = 0; j < bars.length; j++ )
                {
                    if ( bars[ j ].node.name === barName )
                    {
                        bars[ j ].listNodes.push( screws[ i ].node );
                        //console.log( barName );

                    }
                }
            } );
        }

        var screws = this.node.getComponentsInChildren( Screw );
        for ( let i = 0; i < screws.length; i++ )
        {
            const nodeNameParts = screws[ i ].node.name.split( '_' );
            const number = nodeNameParts[ nodeNameParts.length - 1 ];
            screws[ i ].node.getComponent( ScrewRenderer ).colorIndex = parseInt( number );
            //console.log(number);
        }
    }

    setFlex ()
    {

        let screws = this.node.getComponentsInChildren( Screw );
        for ( let i = 0; i < screws.length; i++ )
        {
            //cong y cua tat ca screw them 120
            screws[ i ].node.setPosition( screws[ i ].node.position.x, screws[ i ].node.position.y + 5, screws[ i ].node.position.z );
        }
        var bars = this.node.getComponentsInChildren( BarController );
        for ( let i = 0; i < bars.length; i++ )
        {
            bars[ i ].node.setPosition( bars[ i ].node.position.x, bars[ i ].node.position.y + 5, bars[ i ].node.position.z );
        }
    }
}


