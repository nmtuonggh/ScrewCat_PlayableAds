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
    @property()
    private _updatedGamePlayer = false;
    @property()
    private flex = false;
    @property()
    private syncDataBox = false;
    @property()
    private changeColorData = false;
    @property()
    private switchColor = false;
    @property()
    private changeSpriteFrame = false;

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
    @property()
    fromColor: number = 0;
    @property()
    toColor: number = 0;
    //#endregion

    //#region PROPERTIES
    @property( { group: " Update Game Data" } )
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

    @property( { group: " Flex" } )
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

    @property( { group: " Sync Data Box" } )
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

    @property( { group: " Change Color" } )
    set ChangeColorData ( value: boolean )
    {
        if ( !this.changeColorData )
        {
            this.changeColorData = value;
            this.changeColorScrew();
        }
    }
    get ChangeColorData ()
    {
        return this.changeColorData;
    }

    @property( { group: " Switch Color" } )
    set SwitchColor ( value: boolean )
    {
        if ( !this.switchColor )
        {
            this.switchColor = value;
            this.switchColorScrew();
        }
    }
    get SwitchColor ()
    {
        return this.switchColor;
    }
    @property( { group: " Change Sprite Frame" } )
    set ChangeSpriteFrame ( value: boolean )
    {
        if ( !this.changeSpriteFrame )
        {
            this.changeSpriteFrame = value;
            this.ChangeSF();
        }
    }
    get ChangeSpriteFrame ()
    {
        return this.changeSpriteFrame;
    }
    //#endregion

    //#region Update Game Layer
    updateGameLayer ()
    {
        var gamelayers = this.node.getComponentsInChildren( GameLayerOder );
        for ( let i = 0; i < gamelayers.length; i++ )
        {
            gamelayers[ i ].layerOrder = i;
        }
    }
    //#endregion

    //#region Update Layer Bar And Screw
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
    //#endregion

    //#region Set Polygon Collider
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
    //#endregion

    //#region Set Screw To Bar
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
    //#endregion
    //#region Change Color
    changeColorScrew ()
    {
        var screws = this.node.getComponentsInChildren( Screw );
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

        // for ( let i = 0; i < listDataScrews.length; i++ )
        // {
        //     console.log( listDataScrews[ i ].colorId );
        // }

        for ( let i = 0; i < screws.length; i++ )
        {
            screws[ i ].node.getComponent( ScrewRenderer ).colorIndex = listDataScrews[ i ].colorId;
        }
    }
    //#endregion

    //#region Switch Color
    switchColorScrew ()
    {
        var screws = this.node.getComponentsInChildren( Screw );
        for ( let i = 0; i < screws.length; i++ )
        {
            let colorIndex = screws[ i ].node.getComponent( ScrewRenderer ).colorIndex;
            if ( colorIndex === this.fromColor )
            {
                screws[ i ].node.getComponent( ScrewRenderer ).colorIndex = this.toColor;
            }
        }
    }
    //#endregion
    //#region ChangePicktu
    //#region Flex
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
    //#endregion
    //#region Change Sprite Frame
    ChangeSF ()
    {
        var bars = this.node.getComponentsInChildren( BarController );
        bars.forEach( bar =>
        {
            this.listSpriteFrame.forEach( spriteFrame =>
            {
                if ( bar.node.name === spriteFrame.name )
                {
                    const sprite = bar.node.children[ 0 ].getComponent( Sprite );
                    if ( sprite )
                    {
                        sprite.spriteFrame = spriteFrame;
                    }
                }
            } );
        } );
    }
    //#endregion
}


