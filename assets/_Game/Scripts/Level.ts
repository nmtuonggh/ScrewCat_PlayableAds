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
import { GameLayerOder } from './GameComponent/GameLayerOder';
import { resources } from 'cc';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';

const { ccclass, property } = _decorator;

@ccclass( 'Level' )
export class Level extends Component
{
    //#region PRIVATE FIELDS
    private _updatedGamePlayer = false;
    private updatedHideLayer = false;
    private flex = false;
    private syncDataBox = false;

    private barLayer: 10;
    private screwLayer: 11;
    @property()
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

        }
    }

    get SyncDataBox ()
    {
        return this.syncDataBox;
    }
    @property
    set UpdatedHideLayer ( value: boolean )
    {
        if ( !this.updatedHideLayer )
        {
            this.updatedHideLayer = value;
            this.setHideLayer();
        }
    }

    get UpdatedHideLayer ()
    {
        return this.updatedHideLayer;
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
            element.getComponent( PolygonCollider2D ).points = modelCollider.points;
            element.getComponent( PolygonCollider2D ).apply();
            modelCollider.destroy();
        } );
    }

    setHideLayer ()
    {
        // if ( Editor )
        // {
           
            const assetPath = 'db://assets/_Game/Images/hideImage';

            resources.loadDir(assetPath, SpriteFrame, (err, assets) => 
            {
                if ( err )
                {
                    console.error( err );
                    return;
                }
                var bars = this.node.getComponentsInChildren( BarController );
                assets.forEach( image =>
                {
                    bars.forEach( element =>
                    {
                        if ( element.node.name = image.name )
                        {
                            var hideImage = element.node.children[ 1 ].getComponent( Sprite );
                            hideImage.spriteFrame = image;
                        }
                    } );
                } );
            }
            );
        //};
    }


    setScrewToBar ()
    {
        var bars = this.node.getComponentsInChildren( BarController );

        for ( let i = 0; i < bars.length; i++ )
        {
            if ( bars[ i ].ListScrews.length !== 0 ) continue;
            const bar = bars[ i ];
            bar.ListScrews.length = 0;

            let listScrewInLayer = bar.node.parent.getComponentsInChildren( Screw );

            for ( let j = 0; j < listScrewInLayer.length; j++ )
            {
                const screw = listScrewInLayer[ j ];
                const fullName = screw.node.name;
                const extractedName = fullName.substring( fullName.indexOf( "Bar_" ) );
                const barName = bar.node.name;

                if ( extractedName === barName )
                {
                    bar.ListScrews.push( screw );
                }

                //lay colorIndex
                const parts = fullName.split( "_" );
                const colorIndex = parts[ 1 ];

                screw.ScrewRenderer.colorIndex = parseInt( colorIndex );

            }
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


