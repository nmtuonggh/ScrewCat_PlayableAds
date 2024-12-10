import { _decorator, Component, Node } from 'cc';
import { GameLayer } from './GameComponent/GameLayer';
import { BarController } from './GameComponent/Bar/BarController';
import { Screw } from './GameComponent/Screw/Screw';
import { PolygonCollider2D } from 'cc';
import { HingeJoint2D } from 'cc';
import { RigidBody2D } from 'cc';
import { ERigidBody2DType } from 'cc';
import { JsonAsset } from 'cc';
import { LevelController } from './Controller/LevelController';
const { ccclass, property } = _decorator;

@ccclass( 'Level' )
export class Level extends Component
{
    //#region PRIVATE FIELDS
    private _updatedGamePlayer = false;
    private flex = false;
    private syncDataBox = false;

    @property( JsonAsset )
    public jsonFile: JsonAsset = null;
    @property( LevelController )
    public levelController: LevelController = null;

    private barLayer: 10;
    private screwLayer: 11;
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
            this.setKinematic();
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
            this.getDataBoxSpawn();
        }
    }
    get SyncDataBox ()
    {
        return this.syncDataBox;
    }
    //#endregion

    updateGameLayer ()
    {
        var gamelayers = this.node.getComponentsInChildren( GameLayer );
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
        } );
        screws.forEach( element =>
        {
            element.node.layer = 1 << 11;
        } );
    }

    setPolygonCollider ()
    {
        var bars = this.node.getComponentsInChildren( BarController );
        bars.forEach( element =>
        {
            var modelCollider = element.node.children[ 0 ].getComponent( PolygonCollider2D );
            if ( modelCollider === null ) return;
            element.getComponent( PolygonCollider2D ).points = modelCollider.points;
            element.getComponent( PolygonCollider2D ).apply();
            modelCollider.destroy();
        } );
    }

    getDataBoxSpawn ()
    {
        try
        {
            const data = this.jsonFile.json;
            this.levelController.colorBoxSpawnData = [];
            if ( data.BoxData && Array.isArray( data.BoxData ) )
            {
                for ( let i = 0; i < data.BoxData.length; i++ )
                {
                    const item = data.BoxData[ i ];
                    console.log("Color: ", item.Color)
                    console.log("HoleCount: ", item.HoleCount)
                    this.levelController.colorBoxSpawnData.push( {
                        color: item.Color,
                        holeCount: item.HoleCount   
                    } );
                }
            }
        } catch ( error )
        {
            console.error( "Failed to load box data:", error );
        }
    }

    setScrewToBar ()
    {
        var bars = this.node.getComponentsInChildren( BarController );

        for ( let i = 0; i < bars.length; i++ ) 
        {
            if ( bars[ i ].listScrews.length !== 0 ) continue;
            const bar = bars[ i ];
            bar.listScrews.length = 0;

            let listScrewInLayer = bar.node.parent.getComponentsInChildren( Screw );

            for ( let j = 0; j < listScrewInLayer.length; j++ )
            {
                const screw = listScrewInLayer[ j ];
                const fullName = screw.node.name;
                const extractedName = fullName.substring( fullName.indexOf( "Bar_" ) );
                const barName = bar.node.name;

                if ( extractedName === barName )
                {
                    bar.listScrews.push( screw );
                }

                //lay colorIndex
                const parts = fullName.split( "_" );
                const colorIndex = parts[ 1 ];

                screw.ScrewRenderer.colorIndex = parseInt( colorIndex );

            }
        }
    }

    setchildScrew ()
    {
        var screws = this.node.getComponentsInChildren( Screw );
        for ( let i = 0; i < screws.length; i++ ) 
        {
            var childs = screws[ i ].node.children;
            childs.forEach( element =>
            {
                element.layer = 1 << 11;
            } );

        }
    }
    setKinematic ()
    {
        var bars = this.node.getComponentsInChildren( BarController );
        bars.forEach( element =>
        {
            var rigidBody = element.getComponent( RigidBody2D );

        } );
    }
}


